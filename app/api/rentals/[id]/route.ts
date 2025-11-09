/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationTemplates } from '@/lib/notifications'

// GET single rental by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        payments: true
      }
    })

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, rental })
  } catch (error) {
    console.error('Get rental error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rental' },
      { status: 500 }
    )
  }
}

// PUT update rental
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      startDate,
      endDate,
      status,
      paymentStatus,
      withDriver,
      insurance,
      notes,
      overrideMaintenanceConflict
    } = body

    // Get existing rental
    const existingRental = await prisma.rental.findUnique({
      where: { id },
      include: { vehicle: true }
    })

    if (!existingRental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    // Check for maintenance conflicts during the rental period
    const start = startDate ? new Date(startDate) : new Date(existingRental.startDate)
    const end = endDate ? new Date(endDate) : new Date(existingRental.endDate)

    const conflictingMaintenance = await prisma.maintenance.findMany({
      where: {
        vehicleId: existingRental.vehicleId,
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

    // If there's a maintenance conflict and no override, block the update
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

    // Recalculate total if dates or options change
    let totalAmount = existingRental.totalAmount

    if (startDate && endDate) {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      if (days > 0) {
        totalAmount = existingRental.vehicle.price * days
        if (withDriver !== undefined ? withDriver : existingRental.withDriver) {
          totalAmount += 50 * days
        }
        if (insurance !== undefined ? insurance : existingRental.insurance) {
          totalAmount += 20 * days
        }
      }
    }

    const rental = await prisma.rental.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        paymentStatus,
        withDriver,
        insurance,
        totalAmount,
        notes
      },
      include: {
        customer: true,
        vehicle: true
      }
    })

    // Update vehicle status based on rental status
    if (status === 'completed' || status === 'cancelled') {
      await prisma.vehicle.update({
        where: { id: rental.vehicleId },
        data: { status: 'available' }
      })

      // Send notification based on status change
      if (status === 'completed' && existingRental.status !== 'completed') {
        await NotificationTemplates.rentalCompleted(rental.customer.name, rental.vehicle.name)
      } else if (status === 'cancelled' && existingRental.status !== 'cancelled') {
        await NotificationTemplates.rentalCancelled(rental.customer.name, rental.vehicle.name)
      }
    } else if (status === 'active') {
      await prisma.vehicle.update({
        where: { id: rental.vehicleId },
        data: { status: 'rented' }
      })
    }

    // Send notification for payment status change
    if (paymentStatus === 'paid' && existingRental.paymentStatus !== 'paid') {
      await NotificationTemplates.paymentReceived(rental.totalAmount, rental.customer.name)
    }

    return NextResponse.json({ success: true, rental })
  } catch (error: any) {
    console.error('Update rental error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update rental' },
      { status: 500 }
    )
  }
}

// DELETE rental
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Get rental to update vehicle status
    const rental = await prisma.rental.findUnique({
      where: { id }
    })

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    // Delete rental
    await prisma.rental.delete({
      where: { id }
    })

    // Update vehicle status back to available
    await prisma.vehicle.update({
      where: { id: rental.vehicleId },
      data: { status: 'available' }
    })

    return NextResponse.json({ success: true, message: 'Rental deleted successfully' })
  } catch (error: any) {
    console.error('Delete rental error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete rental' },
      { status: 500 }
    )
  }
}
