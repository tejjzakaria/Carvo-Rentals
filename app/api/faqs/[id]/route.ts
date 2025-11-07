import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single FAQ by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const faq = await prisma.fAQ.findUnique({
      where: { id }
    })

    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, faq })
  } catch (error) {
    console.error('Get FAQ error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FAQ' },
      { status: 500 }
    )
  }
}

// PUT update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { question, answer, category, order, isActive } = body

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return NextResponse.json({ success: true, faq })
  } catch (error: any) {
    console.error('Update FAQ error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    )
  }
}

// DELETE FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.fAQ.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' })
  } catch (error: any) {
    console.error('Delete FAQ error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'FAQ not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    )
  }
}
