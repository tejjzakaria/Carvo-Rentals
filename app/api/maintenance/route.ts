import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// GET all maintenance records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming') // For dashboard alerts

    const where: any = {}
    if (vehicleId) where.vehicleId = vehicleId
    if (status) where.status = status

    // For upcoming maintenance
    if (upcoming === 'true') {
      const now = new Date()
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7) // Next 7 days

      where.scheduledDate = {
        gte: now,
        lte: futureDate
      }
      where.status = { in: ['scheduled', 'in_progress'] }
    }

    const maintenances = await prisma.maintenance.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            plateNumber: true,
            category: true,
            status: true
          }
        }
      },
      orderBy: {
        scheduledDate: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      maintenances
    })
  } catch (error) {
    console.error('Error fetching maintenance records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch maintenance records' },
      { status: 500 }
    )
  }
}

// POST create new maintenance
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      vehicleId,
      maintenanceType,
      description,
      cost,
      serviceProvider,
      status,
      scheduledDate,
      completedDate,
      mileageAtService,
      nextServiceDue,
      notes
    } = body

    // Validate required fields
    if (!vehicleId || !maintenanceType || !description || !scheduledDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Create maintenance
    const maintenance = await prisma.maintenance.create({
      data: {
        vehicleId,
        maintenanceType,
        description,
        cost: cost || 0,
        serviceProvider: serviceProvider || null,
        status: status || 'scheduled',
        scheduledDate: new Date(scheduledDate),
        completedDate: completedDate ? new Date(completedDate) : null,
        mileageAtService: mileageAtService || null,
        nextServiceDue: nextServiceDue ? new Date(nextServiceDue) : null,
        notes: notes || null
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            plateNumber: true
          }
        }
      }
    })

    // Only update vehicle status to maintenance if:
    // 1. Status is in_progress (actively being worked on), OR
    // 2. Status is scheduled AND scheduled date is today or in the past
    const scheduledDateObj = new Date(scheduledDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    scheduledDateObj.setHours(0, 0, 0, 0)

    const shouldSetToMaintenance =
      status === 'in_progress' ||
      (status === 'scheduled' && scheduledDateObj <= today)

    if (shouldSetToMaintenance && vehicle.status !== 'maintenance') {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'maintenance' }
      })
    }

    // Create notification for scheduled maintenance
    await createNotification({
      type: 'maintenance',
      title: 'Maintenance Scheduled',
      message: `${maintenanceType} scheduled for ${maintenance.vehicle.name} on ${new Date(scheduledDate).toLocaleDateString()}`
    })

    return NextResponse.json({
      success: true,
      maintenance
    })
  } catch (error) {
    console.error('Error creating maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create maintenance' },
      { status: 500 }
    )
  }
}
