import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single feature by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const feature = await prisma.feature.findUnique({
      where: { id }
    })

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, feature })
  } catch (error) {
    console.error('Get feature error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { status: 500 }
    )
  }
}

// PUT update feature
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      icon,
      iconUrl,
      title,
      description,
      order,
      isActive
    } = body

    const feature = await prisma.feature.update({
      where: { id },
      data: {
        icon,
        iconUrl: iconUrl !== undefined ? iconUrl : undefined,
        title,
        description,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({ success: true, feature })
  } catch (error: any) {
    console.error('Update feature error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    )
  }
}

// DELETE feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.feature.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Feature deleted successfully' })
  } catch (error: any) {
    console.error('Delete feature error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    )
  }
}
