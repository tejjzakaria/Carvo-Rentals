import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    const stats = await prisma.stat.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

// POST create new stat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { number, label, icon, iconUrl, color, order, isActive } = body

    // Validation
    if (!number || !label || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const stat = await prisma.stat.create({
      data: {
        number,
        label,
        icon,
        iconUrl: iconUrl || null,
        color: color || 'from-primary to-primary-light',
        order: order !== undefined ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(
      { success: true, stat },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create stat error:', error)
    return NextResponse.json(
      { error: 'Failed to create stat' },
      { status: 500 }
    )
  }
}
