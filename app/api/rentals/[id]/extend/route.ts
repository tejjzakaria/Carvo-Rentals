import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Extend rental
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { newEndDate, additionalCost } = body
    const { id } = await params

    if (!newEndDate || additionalCost === undefined) {
      return NextResponse.json(
        { error: 'New end date and additional cost are required' },
        { status: 400 }
      )
    }

    // Get the existing rental
    const existingRental = await prisma.rental.findUnique({
      where: { id },
      include: {
        vehicle: true
      }
    })

    if (!existingRental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    // Validate that new end date is after current end date
    const currentEnd = new Date(existingRental.endDate)
    const newEnd = new Date(newEndDate)

    if (newEnd <= currentEnd) {
      return NextResponse.json(
        { error: 'New end date must be after current end date' },
        { status: 400 }
      )
    }

    // Check vehicle availability for the extension period
    const nextDay = new Date(currentEnd)
    nextDay.setDate(nextDay.getDate() + 1)

    const conflictingRentals = await prisma.rental.findMany({
      where: {
        vehicleId: existingRental.vehicleId,
        id: { not: id }, // Exclude current rental
        status: {
          in: ['pending', 'active']
        },
        OR: [
          // Extension period starts during existing rental
          {
            AND: [
              { startDate: { lte: nextDay } },
              { endDate: { gte: nextDay } }
            ]
          },
          // Extension period ends during existing rental
          {
            AND: [
              { startDate: { lte: newEnd } },
              { endDate: { gte: newEnd } }
            ]
          },
          // Extension period completely contains existing rental
          {
            AND: [
              { startDate: { gte: nextDay } },
              { endDate: { lte: newEnd } }
            ]
          }
        ]
      }
    })

    if (conflictingRentals.length > 0) {
      return NextResponse.json(
        { error: 'Vehicle is not available for the selected extension period' },
        { status: 400 }
      )
    }

    // Update the rental
    const updatedRental = await prisma.rental.update({
      where: { id },
      data: {
        endDate: new Date(newEndDate),
        totalAmount: existingRental.totalAmount + additionalCost
      },
      include: {
        customer: true,
        vehicle: true
      }
    })

    // Create notification for rental extension
    await prisma.notification.create({
      data: {
        type: 'rental',
        title: 'Rental Extended',
        message: `Rental ${existingRental.rentalId} has been extended until ${newEnd.toLocaleDateString()}. Customer: ${updatedRental.customer.name}`,
        read: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Rental extended successfully',
      rental: updatedRental
    })
  } catch (error) {
    console.error('Extend rental error:', error)
    return NextResponse.json(
      { error: 'Failed to extend rental' },
      { status: 500 }
    )
  }
}
