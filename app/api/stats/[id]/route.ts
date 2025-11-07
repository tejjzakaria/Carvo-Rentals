import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single stat by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const stat = await prisma.stat.findUnique({
      where: { id }
    })

    if (!stat) {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, stat })
  } catch (error) {
    console.error('Get stat error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stat' },
      { status: 500 }
    )
  }
}

// PUT update stat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { number, label, icon, iconUrl, color, order, isActive } = body

    // Check if stat exists
    const existingStat = await prisma.stat.findUnique({
      where: { id }
    })

    if (!existingStat) {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      )
    }

    const stat = await prisma.stat.update({
      where: { id },
      data: {
        number,
        label,
        icon,
        iconUrl: iconUrl !== undefined ? iconUrl : undefined,
        color,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({ success: true, stat })
  } catch (error: any) {
    console.error('Update stat error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update stat' },
      { status: 500 }
    )
  }
}

// DELETE stat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if stat exists
    const stat = await prisma.stat.findUnique({
      where: { id }
    })

    if (!stat) {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      )
    }

    // Delete stat
    await prisma.stat.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Stat deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete stat error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete stat' },
      { status: 500 }
    )
  }
}
