import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Create booking request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      vehicleId,
      customerName,
      customerEmail,
      customerPhone,
      customerLocation,
      startDate,
      endDate,
      withDriver,
      insurance,
      notes,
      totalAmount
    } = body

    // Validate required fields
    if (!vehicleId || !customerName || !customerEmail || !customerPhone || !customerLocation || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if customer exists by email
    let customer = await prisma.customer.findUnique({
      where: { email: customerEmail }
    })

    // If customer doesn't exist, create new customer
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          location: customerLocation,
          status: 'active'
        }
      })
    }

    // Generate rental ID
    const rentalCount = await prisma.rental.count()
    const rentalId = `RNT-${String(rentalCount + 1).padStart(4, '0')}`

    // Create rental/booking
    const rental = await prisma.rental.create({
      data: {
        rentalId,
        customerId: customer.id,
        vehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'pending',
        withDriver: withDriver || false,
        insurance: insurance || false,
        totalAmount: totalAmount || 0,
        paymentStatus: 'pending',
        notes: notes || ''
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully',
      rental,
      rentalId
    })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
