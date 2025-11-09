/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// GET all damages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const rentalId = searchParams.get('rentalId')
    const status = searchParams.get('status')

    const where: any = {}
    if (vehicleId) where.vehicleId = vehicleId
    if (rentalId) where.rentalId = rentalId
    if (status) {
      // Support multiple statuses separated by comma
      if (status.includes(',')) {
        where.status = { in: status.split(',').map(s => s.trim()) }
      } else {
        where.status = status
      }
    }

    const damages = await prisma.damage.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            plateNumber: true,
            category: true
          }
        },
        rental: {
          select: {
            id: true,
            rentalId: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        reportedDate: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      damages
    })
  } catch (error) {
    console.error('Error fetching damages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch damages' },
      { status: 500 }
    )
  }
}

// POST create new damage
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      vehicleId,
      rentalId,
      severity,
      description,
      repairCost,
      insuranceClaim,
      claimAmount,
      status,
      images,
      reportedDate
    } = body

    // Validate required fields
    if (!vehicleId || !severity || !description) {
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

    // Create damage
    const damage = await prisma.damage.create({
      data: {
        vehicleId,
        rentalId: rentalId || null,
        severity,
        description,
        repairCost: repairCost || 0,
        insuranceClaim: insuranceClaim || false,
        claimAmount: claimAmount || null,
        status: status || 'reported',
        images: images || [],
        reportedDate: reportedDate ? new Date(reportedDate) : new Date()
      },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            plateNumber: true
          }
        },
        rental: {
          select: {
            id: true,
            rentalId: true,
            customer: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Update vehicle status based on damage severity and status
    if (status === 'reported' || status === 'in_repair') {
      let newVehicleStatus = 'maintenance'

      // Set status based on severity
      if (severity === 'minor') {
        newVehicleStatus = 'minor_damage'
      } else if (severity === 'moderate') {
        newVehicleStatus = 'moderate_damage'
      } else if (severity === 'severe') {
        newVehicleStatus = 'severe_damage'
      }

      // Only update if the vehicle isn't already in a worse condition
      // severe_damage > moderate_damage > minor_damage > maintenance
      const shouldUpdate =
        vehicle.status === 'available' ||
        (newVehicleStatus === 'severe_damage') ||
        (newVehicleStatus === 'moderate_damage' && vehicle.status !== 'severe_damage') ||
        (newVehicleStatus === 'minor_damage' && !['severe_damage', 'moderate_damage'].includes(vehicle.status))

      if (shouldUpdate) {
        await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { status: newVehicleStatus }
        })
      }
    }

    // Create notification for new damage report
    await createNotification({
      type: 'maintenance',
      title: 'Damage Reported',
      message: `${severity} damage reported for ${damage.vehicle.name}: ${description}`
    })

    return NextResponse.json({
      success: true,
      damage
    })
  } catch (error) {
    console.error('Error creating damage:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create damage' },
      { status: 500 }
    )
  }
}
