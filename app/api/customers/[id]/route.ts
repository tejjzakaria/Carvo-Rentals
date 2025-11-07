import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        rentals: {
          include: {
            vehicle: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, customer })
  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

// PUT update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      email,
      phone,
      location,
      status,
      avatar
    } = body

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        location,
        status,
        avatar
      }
    })

    return NextResponse.json({ success: true, customer })
  } catch (error: any) {
    console.error('Update customer error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

// DELETE customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if customer has any rentals
    const rentalCount = await prisma.rental.count({
      where: { customerId: id }
    })

    if (rentalCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing rentals' },
        { status: 400 }
      )
    }

    await prisma.customer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' })
  } catch (error: any) {
    console.error('Delete customer error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}
