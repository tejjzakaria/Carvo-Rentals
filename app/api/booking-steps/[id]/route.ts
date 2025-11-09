/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single booking step by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const step = await prisma.bookingStep.findUnique({
      where: { id }
    })

    if (!step) {
      return NextResponse.json(
        { error: 'Booking step not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, step })
  } catch (error) {
    console.error('Get booking step error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking step' },
      { status: 500 }
    )
  }
}

// PUT update booking step
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      stepNumber,
      icon,
      iconUrl,
      title,
      description,
      order,
      isActive
    } = body

    const step = await prisma.bookingStep.update({
      where: { id },
      data: {
        stepNumber,
        icon,
        iconUrl: iconUrl !== undefined ? iconUrl : undefined,
        title,
        description,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({ success: true, step })
  } catch (error: any) {
    console.error('Update booking step error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Booking step not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update booking step' },
      { status: 500 }
    )
  }
}

// DELETE booking step
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.bookingStep.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Booking step deleted successfully' })
  } catch (error: any) {
    console.error('Delete booking step error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Booking step not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete booking step' },
      { status: 500 }
    )
  }
}
