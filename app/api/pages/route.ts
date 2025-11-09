/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all pages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    const pages = await prisma.page.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, pages })
  } catch (error) {
    console.error('Get pages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST create new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, order, isActive } = body

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    })

    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        order: order !== undefined ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ success: true, page }, { status: 201 })
  } catch (error: any) {
    console.error('Create page error:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
