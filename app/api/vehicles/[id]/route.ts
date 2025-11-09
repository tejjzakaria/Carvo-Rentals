/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// GET single vehicle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, vehicle })
  } catch (error) {
    console.error('Get vehicle error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}

// PUT update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Get existing vehicle to compare status
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id }
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        name,
        category,
        plateNumber,
        year: year ? parseInt(year) : undefined,
        seats: seats ? parseInt(seats) : undefined,
        transmission,
        fuelType,
        mileage: mileage ? parseInt(mileage) : undefined,
        price: price ? parseFloat(price) : undefined,
        status,
        featured: featured !== undefined ? featured : undefined,
        features,
        description,
        images
      }
    })

    // Create notification if status changed
    if (status && status !== existingVehicle.status) {
      await createNotification({
        type: 'vehicle',
        title: 'Vehicle Status Changed',
        message: `${vehicle.name} status changed from ${existingVehicle.status} to ${status}`
      })
    }

    return NextResponse.json({ success: true, vehicle })
  } catch (error: any) {
    console.error('Update vehicle error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A vehicle with this plate number already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

// DELETE vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if vehicle has any rentals
    const rentalCount = await prisma.rental.count({
      where: { vehicleId: id }
    })

    if (rentalCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete vehicle with existing rentals' },
        { status: 400 }
      )
    }

    await prisma.vehicle.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' })
  } catch (error: any) {
    console.error('Delete vehicle error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}
