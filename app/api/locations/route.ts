/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all locations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    const locations = await prisma.location.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, locations })
  } catch (error) {
    console.error('Get locations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

// POST create new location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, order, isActive } = body

    const location = await prisma.location.create({
      data: {
        name,
        order: order !== undefined ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ success: true, location }, { status: 201 })
  } catch (error: any) {
    console.error('Create location error:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A location with this name already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    )
  }
}
