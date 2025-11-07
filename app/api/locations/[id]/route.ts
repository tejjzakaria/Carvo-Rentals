import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single location by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const location = await prisma.location.findUnique({
      where: { id }
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, location })
  } catch (error) {
    console.error('Get location error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    )
  }
}

// PUT update location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, order, isActive } = body

    const location = await prisma.location.update({
      where: { id },
      data: {
        name,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({ success: true, location })
  } catch (error: any) {
    console.error('Update location error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A location with this name already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    )
  }
}

// DELETE location
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.location.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Location deleted successfully' })
  } catch (error: any) {
    console.error('Delete location error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 }
    )
  }
}
