/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all features
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: any = {}

    if (activeOnly) {
      where.isActive = true
    }

    const features = await prisma.feature.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, features })
  } catch (error) {
    console.error('Get features error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    )
  }
}

// POST create new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      icon,
      iconUrl,
      title,
      description,
      order,
      isActive
    } = body

    // Validation
    if (!icon || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const feature = await prisma.feature.create({
      data: {
        icon,
        iconUrl: iconUrl || null,
        title,
        description,
        order: order !== undefined ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ success: true, feature }, { status: 201 })
  } catch (error) {
    console.error('Create feature error:', error)
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    )
  }
}
