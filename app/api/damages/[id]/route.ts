import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// GET single damage
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const damage = await prisma.damage.findUnique({
      where: { id },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            plateNumber: true,
            category: true,
            status: true
          }
        },
        rental: {
          select: {
            id: true,
            rentalId: true,
            startDate: true,
            endDate: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    })

    if (!damage) {
      return NextResponse.json(
        { success: false, error: 'Damage not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      damage
    })
  } catch (error) {
    console.error('Error fetching damage:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch damage' },
      { status: 500 }
    )
  }
}

// PUT update damage
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      severity,
      description,
      repairCost,
      insuranceClaim,
      claimAmount,
      status,
      images,
      repairedDate
    } = body

    // Check if damage exists
    const existingDamage = await prisma.damage.findUnique({
      where: { id },
      include: {
        vehicle: true
      }
    })

    if (!existingDamage) {
      return NextResponse.json(
        { success: false, error: 'Damage not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (severity !== undefined) updateData.severity = severity
    if (description !== undefined) updateData.description = description
    if (repairCost !== undefined) updateData.repairCost = repairCost
    if (insuranceClaim !== undefined) updateData.insuranceClaim = insuranceClaim
    if (claimAmount !== undefined) updateData.claimAmount = claimAmount
    if (status !== undefined) updateData.status = status
    if (images !== undefined) updateData.images = images
    if (repairedDate !== undefined) updateData.repairedDate = repairedDate ? new Date(repairedDate) : null

    const damage = await prisma.damage.update({
      where: { id },
      data: updateData,
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
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Recalculate vehicle status based on all damages and maintenance
    // Get all open damages for this vehicle (excluding current one if repaired)
    const openDamages = await prisma.damage.findMany({
      where: {
        vehicleId: existingDamage.vehicleId,
        id: status === 'repaired' ? { not: id } : undefined,
        status: { in: ['reported', 'in_repair'] }
      },
      select: {
        severity: true
      }
    })

    // Check for scheduled maintenance that is due today or in progress
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeMaintenance = await prisma.maintenance.count({
      where: {
        vehicleId: existingDamage.vehicleId,
        OR: [
          { status: 'in_progress' },
          {
            status: 'scheduled',
            scheduledDate: { lte: new Date() }
          }
        ]
      }
    })

    // Determine the new vehicle status
    let newVehicleStatus = 'available'

    if (openDamages.length > 0) {
      // Find the most severe damage
      const hasSevere = openDamages.some(d => d.severity === 'severe')
      const hasModerate = openDamages.some(d => d.severity === 'moderate')
      const hasMinor = openDamages.some(d => d.severity === 'minor')

      if (hasSevere) {
        newVehicleStatus = 'severe_damage'
      } else if (hasModerate) {
        newVehicleStatus = 'moderate_damage'
      } else if (hasMinor) {
        newVehicleStatus = 'minor_damage'
      }
    } else if (activeMaintenance > 0) {
      newVehicleStatus = 'maintenance'
    }

    // Update vehicle status
    await prisma.vehicle.update({
      where: { id: existingDamage.vehicleId },
      data: { status: newVehicleStatus }
    })

    // Create notification when damage is repaired
    if (status === 'repaired' && existingDamage.status !== 'repaired') {
      await createNotification({
        type: 'maintenance',
        title: 'Damage Resolved',
        message: `Damage repaired for ${damage.vehicle.name}: ${damage.description}`
      })
    }

    return NextResponse.json({
      success: true,
      damage
    })
  } catch (error) {
    console.error('Error updating damage:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update damage' },
      { status: 500 }
    )
  }
}

// DELETE damage
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const damage = await prisma.damage.findUnique({
      where: { id }
    })

    if (!damage) {
      return NextResponse.json(
        { success: false, error: 'Damage not found' },
        { status: 404 }
      )
    }

    await prisma.damage.delete({
      where: { id }
    })

    // Recalculate vehicle status after deletion
    const openDamages = await prisma.damage.findMany({
      where: {
        vehicleId: damage.vehicleId,
        status: { in: ['reported', 'in_repair'] }
      },
      select: {
        severity: true
      }
    })

    // Check for active maintenance
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeMaintenance = await prisma.maintenance.count({
      where: {
        vehicleId: damage.vehicleId,
        OR: [
          { status: 'in_progress' },
          {
            status: 'scheduled',
            scheduledDate: { lte: new Date() }
          }
        ]
      }
    })

    // Determine the new vehicle status
    let newVehicleStatus = 'available'

    if (openDamages.length > 0) {
      // Find the most severe damage
      const hasSevere = openDamages.some(d => d.severity === 'severe')
      const hasModerate = openDamages.some(d => d.severity === 'moderate')
      const hasMinor = openDamages.some(d => d.severity === 'minor')

      if (hasSevere) {
        newVehicleStatus = 'severe_damage'
      } else if (hasModerate) {
        newVehicleStatus = 'moderate_damage'
      } else if (hasMinor) {
        newVehicleStatus = 'minor_damage'
      }
    } else if (activeMaintenance > 0) {
      newVehicleStatus = 'maintenance'
    }

    // Update vehicle status
    await prisma.vehicle.update({
      where: { id: damage.vehicleId },
      data: { status: newVehicleStatus }
    })

    return NextResponse.json({
      success: true,
      message: 'Damage deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting damage:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete damage' },
      { status: 500 }
    )
  }
}
