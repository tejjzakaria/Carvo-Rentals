import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, testimonials })
  } catch (error) {
    console.error('Get testimonials error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location, rating, comment, image, isActive } = body

    // Validation
    if (!name || !location || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location,
        rating: parseInt(rating),
        comment,
        image: image || null,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(
      { success: true, testimonial },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
