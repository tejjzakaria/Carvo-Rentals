/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Update payment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { paymentStatus } = body

    // Validate payment status
    const validPaymentStatuses = ['pending', 'paid', 'refunded']
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status value' },
        { status: 400 }
      )
    }

    // Update payment status
    const updatedRental = await prisma.rental.update({
      where: { id },
      data: { paymentStatus },
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
      message: 'Payment status updated successfully'
    })
  } catch (error) {
    console.error('Update payment status error:', error)
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    )
  }
}
