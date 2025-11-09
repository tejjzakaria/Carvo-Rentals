/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// GET single maintenance record
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            plateNumber: true,
            category: true,
            status: true,
            mileage: true
          }
        }
      }
    })

    if (!maintenance) {
      return NextResponse.json(
        { success: false, error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      maintenance
    })
  } catch (error) {
    console.error('Error fetching maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch maintenance record' },
      { status: 500 }
    )
  }
}

// PUT update maintenance
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
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

    // Check if maintenance exists
    const existingMaintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        vehicle: true
      }
    })

    if (!existingMaintenance) {
      return NextResponse.json(
        { success: false, error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (maintenanceType !== undefined) updateData.maintenanceType = maintenanceType
    if (description !== undefined) updateData.description = description
    if (cost !== undefined) updateData.cost = cost
    if (serviceProvider !== undefined) updateData.serviceProvider = serviceProvider
    if (status !== undefined) updateData.status = status
    if (scheduledDate !== undefined) updateData.scheduledDate = new Date(scheduledDate)
    if (completedDate !== undefined) updateData.completedDate = completedDate ? new Date(completedDate) : null
    if (mileageAtService !== undefined) updateData.mileageAtService = mileageAtService
    if (nextServiceDue !== undefined) updateData.nextServiceDue = nextServiceDue ? new Date(nextServiceDue) : null
    if (notes !== undefined) updateData.notes = notes

    const maintenance = await prisma.maintenance.update({
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
        }
      }
    })

    // If maintenance is marked as completed, check if vehicle should be set to available
    if (status === 'completed') {
      // Check if there are any other scheduled maintenance or open damages
      const scheduledMaintenance = await prisma.maintenance.count({
        where: {
          vehicleId: existingMaintenance.vehicleId,
          id: { not: id },
          status: { in: ['scheduled', 'in_progress'] }
        }
      })

      const openDamages = await prisma.damage.count({
        where: {
          vehicleId: existingMaintenance.vehicleId,
          status: { in: ['reported', 'in_repair'] }
        }
      })

      // If no scheduled maintenance or open damages, set vehicle to available
      if (scheduledMaintenance === 0 && openDamages === 0) {
        await prisma.vehicle.update({
          where: { id: existingMaintenance.vehicleId },
          data: { status: 'available' }
        })
      }

      // Create notification when maintenance is completed
      if (existingMaintenance.status !== 'completed') {
        await createNotification({
          type: 'maintenance',
          title: 'Maintenance Completed',
          message: `${maintenance.maintenanceType} completed for ${maintenance.vehicle.name}`
        })
      }
    }

    // Only update vehicle status to maintenance if:
    // 1. Status is in_progress (actively being worked on), OR
    // 2. Status is scheduled AND scheduled date is today or in the past
    if ((status === 'scheduled' || status === 'in_progress') && existingMaintenance.vehicle.status !== 'maintenance') {
      const scheduledDateToCheck = scheduledDate ? new Date(scheduledDate) : new Date(existingMaintenance.scheduledDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      scheduledDateToCheck.setHours(0, 0, 0, 0)

      const shouldSetToMaintenance =
        status === 'in_progress' ||
        (status === 'scheduled' && scheduledDateToCheck <= today)

      if (shouldSetToMaintenance) {
        await prisma.vehicle.update({
          where: { id: existingMaintenance.vehicleId },
          data: { status: 'maintenance' }
        })
      }
    }

    return NextResponse.json({
      success: true,
      maintenance
    })
  } catch (error) {
    console.error('Error updating maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update maintenance record' },
      { status: 500 }
    )
  }
}

// DELETE maintenance
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const maintenance = await prisma.maintenance.findUnique({
      where: { id }
    })

    if (!maintenance) {
      return NextResponse.json(
        { success: false, error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    await prisma.maintenance.delete({
      where: { id }
    })

    // Check if vehicle should be updated to available
    const scheduledMaintenance = await prisma.maintenance.count({
      where: {
        vehicleId: maintenance.vehicleId,
        status: { in: ['scheduled', 'in_progress'] }
      }
    })

    const openDamages = await prisma.damage.count({
      where: {
        vehicleId: maintenance.vehicleId,
        status: { in: ['reported', 'in_repair'] }
      }
    })

    if (scheduledMaintenance === 0 && openDamages === 0) {
      await prisma.vehicle.update({
        where: { id: maintenance.vehicleId },
        data: { status: 'available' }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Maintenance record deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting maintenance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete maintenance record' },
      { status: 500 }
    )
  }
}
