import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Check vehicle availability for date range
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const { id } = await params
    const vehicleId = id
    const start = new Date(startDate)
    const end = new Date(endDate)

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

    // Find conflicting rentals (active or pending)
    const conflictingRentals = await prisma.rental.findMany({
      where: {
        vehicleId,
        status: {
          in: ['pending', 'active']
        },
        OR: [
          // New rental starts during existing rental
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } }
            ]
          },
          // New rental ends during existing rental
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } }
            ]
          },
          // New rental completely contains existing rental
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } }
            ]
          }
        ]
      },
      select: {
        rentalId: true,
        startDate: true,
        endDate: true,
        status: true
      }
    })

    const isAvailable = conflictingRentals.length === 0

    return NextResponse.json({
      success: true,
      available: isAvailable,
      conflictingRentals: conflictingRentals.map(rental => ({
        rentalId: rental.rentalId,
        startDate: rental.startDate,
        endDate: rental.endDate,
        status: rental.status
      }))
    })
  } catch (error) {
    console.error('Check availability error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
