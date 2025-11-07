import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationTemplates } from '@/lib/notifications'

// GET all vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const featuredOnly = searchParams.get('featured') === 'true'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const location = searchParams.get('location')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (featuredOnly) {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { plateNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    // If dates are provided, filter out vehicles with conflicting rentals
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      // Find vehicles that have conflicting rentals
      const conflictingRentals = await prisma.rental.findMany({
        where: {
          status: {
            in: ['pending', 'active']
          },
          OR: [
            {
              AND: [
                { startDate: { lte: start } },
                { endDate: { gte: start } }
              ]
            },
            {
              AND: [
                { startDate: { lte: end } },
                { endDate: { gte: end } }
              ]
            },
            {
              AND: [
                { startDate: { gte: start } },
                { endDate: { lte: end } }
              ]
            }
          ]
        },
        select: {
          vehicleId: true
        }
      })

      const conflictingVehicleIds = conflictingRentals.map(r => r.vehicleId)

      // Exclude vehicles with conflicts
      if (conflictingVehicleIds.length > 0) {
        where.id = { notIn: conflictingVehicleIds }
      }
    }

    // Get total count for pagination
    const total = await prisma.vehicle.count({ where })

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    return NextResponse.json({
      success: true,
      vehicles,
      filters: {
        category,
        startDate,
        endDate,
        location
      },
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Get vehicles error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

// POST create new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      category,
      plateNumber,
      year,
      seats,
      transmission,
      fuelType,
      mileage,
      price,
      status,
      featured,
      features,
      description,
      images
    } = body

    // Validation
    if (!name || !category || !plateNumber || !year || !seats || !transmission || !fuelType || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        category,
        plateNumber,
        year: parseInt(year),
        seats: parseInt(seats),
        transmission,
        fuelType,
        mileage: parseInt(mileage) || 0,
        price: parseFloat(price),
        status: status || 'available',
        featured: featured || false,
        features: features || [],
        description: description || '',
        images: images || []
      }
    })

    // Create notification for new vehicle
    await NotificationTemplates.vehicleAdded(vehicle.name)

    return NextResponse.json({ success: true, vehicle }, { status: 201 })
  } catch (error: any) {
    console.error('Create vehicle error:', error)

    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A vehicle with this plate number already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
