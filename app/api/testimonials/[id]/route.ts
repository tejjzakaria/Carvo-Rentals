import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single testimonial by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, testimonial })
  } catch (error) {
    console.error('Get testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

// PUT update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, location, rating, comment, image, isActive } = body

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        location,
        rating: rating !== undefined ? parseInt(rating) : undefined,
        comment,
        image: image !== undefined ? image : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({ success: true, testimonial })
  } catch (error: any) {
    console.error('Update testimonial error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Delete testimonial
    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete testimonial error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
