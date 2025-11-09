/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all FAQs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('activeOnly') === 'true'
    const category = searchParams.get('category')

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }
    if (category && category !== 'All') {
      where.category = category
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, faqs })
  } catch (error) {
    console.error('Get FAQs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}

// POST create new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, category, order, isActive } = body

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'General',
        order: order !== undefined ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ success: true, faq }, { status: 201 })
  } catch (error: any) {
    console.error('Create FAQ error:', error)
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    )
  }
}
