import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationTemplates } from '@/lib/notifications'

// GET all rentals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { rentalId: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count for pagination
    const total = await prisma.rental.count({ where })

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const rentals = await prisma.rental.findMany({
      where,
      include: {
        customer: true,
        vehicle: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    return NextResponse.json({
      success: true,
      rentals,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Get rentals error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    )
  }
}

// POST create new rental
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      vehicleId,
      startDate,
      endDate,
      withDriver,
      insurance,
      notes,
      overrideMaintenanceConflict
    } = body

    // Validation
    if (!customerId || !vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Check vehicle availability based on status
    // Block: rented, maintenance, severe_damage
    // Allow: available, minor_damage, moderate_damage
    const unavailableStatuses = ['rented', 'maintenance', 'severe_damage']
    if (unavailableStatuses.includes(vehicle.status)) {
      let errorMessage = 'Vehicle is not available for rental'

      if (vehicle.status === 'rented') {
        errorMessage = 'Vehicle is currently rented'
      } else if (vehicle.status === 'maintenance') {
        errorMessage = 'Vehicle is under maintenance'
      } else if (vehicle.status === 'severe_damage') {
        errorMessage = 'Vehicle has severe damage and cannot be rented'
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Get damage information if vehicle has minor or moderate damage
    let vehicleDamages = null
    if (vehicle.status === 'minor_damage' || vehicle.status === 'moderate_damage') {
      vehicleDamages = await prisma.damage.findMany({
        where: {
          vehicleId,
          status: { in: ['reported', 'in_repair'] }
        },
        select: {
          id: true,
          severity: true,
          description: true,
          images: true
        }
      })
    }

    // Check for maintenance conflicts during the rental period
    const start = new Date(startDate)
    const end = new Date(endDate)

    const conflictingMaintenance = await prisma.maintenance.findMany({
      where: {
        vehicleId,
        status: { in: ['scheduled', 'in_progress'] },
        scheduledDate: {
          gte: start,
          lte: end
        }
      },
      select: {
        id: true,
        maintenanceType: true,
        description: true,
        scheduledDate: true,
        status: true,
        cost: true,
        serviceProvider: true
      }
    })

    // If there's a maintenance conflict and no override, block the rental
    if (conflictingMaintenance.length > 0 && !overrideMaintenanceConflict) {
      return NextResponse.json(
        {
          error: 'maintenance_conflict',
          message: 'Vehicle has scheduled maintenance during this rental period',
          maintenanceRecords: conflictingMaintenance
        },
        { status: 409 }
      )
    }

    // If override is true, cancel the conflicting maintenance
    if (conflictingMaintenance.length > 0 && overrideMaintenanceConflict) {
      await prisma.maintenance.updateMany({
        where: {
          id: { in: conflictingMaintenance.map(m => m.id) }
        },
        data: {
          status: 'cancelled'
        }
      })
    }

    // Calculate total amount
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 0) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    let totalAmount = vehicle.price * days
    if (withDriver) totalAmount += 50 * days
    if (insurance) totalAmount += 20 * days

    // Generate rental ID
    const rentalCount = await prisma.rental.count()
    const rentalId = `RNT-${String(rentalCount + 1).padStart(3, '0')}`

    const rental = await prisma.rental.create({
      data: {
        rentalId,
        customerId,
        vehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        withDriver: withDriver || false,
        insurance: insurance || false,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
        notes: notes || ''
      },
      include: {
        customer: true,
        vehicle: true
      }
    })

    // Update vehicle status to rented
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'rented' }
    })

    // Update customer stats
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalRentals: { increment: 1 },
        totalSpent: { increment: totalAmount }
      }
    })

    // Create notification for new rental
    await NotificationTemplates.newRental(customer.name, vehicle.name)

    return NextResponse.json({
      success: true,
      rental,
      vehicleDamages: vehicleDamages || []
    }, { status: 201 })
  } catch (error) {
    console.error('Create rental error:', error)
    return NextResponse.json(
      { error: 'Failed to create rental' },
      { status: 500 }
    )
  }
}
