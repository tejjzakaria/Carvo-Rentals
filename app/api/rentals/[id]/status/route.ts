import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Update rental status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'active', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Update rental status
    const updatedRental = await prisma.rental.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      rental: updatedRental,
      message: 'Rental status updated successfully'
    })
  } catch (error) {
    console.error('Update rental status error:', error)
    return NextResponse.json(
      { error: 'Failed to update rental status' },
      { status: 500 }
    )
  }
}
