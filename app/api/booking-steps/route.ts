/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all booking steps
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: any = {}

    if (activeOnly) {
      where.isActive = true
    }

    const steps = await prisma.bookingStep.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, steps })
  } catch (error) {
    console.error('Get booking steps error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking steps' },
      { status: 500 }
    )
  }
}

// POST create new booking step
export async function POST(request: NextRequest) {
  try {
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

    // Validation
    if (!stepNumber || !icon || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const step = await prisma.bookingStep.create({
      data: {
        stepNumber,
        icon,
        iconUrl: iconUrl || null,
        title,
        description,
        order: order !== undefined ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ success: true, step }, { status: 201 })
  } catch (error) {
    console.error('Create booking step error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking step' },
      { status: 500 }
    )
  }
}
