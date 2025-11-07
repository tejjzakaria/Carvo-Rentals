import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single page by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const page = await prisma.page.findUnique({
      where: { id }
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, page })
  } catch (error) {
    console.error('Get page error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

// PUT update page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, content, order, isActive } = body

    // If slug is being updated, check if it already exists (excluding current page)
    if (slug) {
      const existingPage = await prisma.page.findUnique({
        where: { slug }
      })

      if (existingPage && existingPage.id !== id) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({ success: true, page })
  } catch (error: any) {
    console.error('Update page error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.page.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Page deleted successfully' })
  } catch (error: any) {
    console.error('Delete page error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}
