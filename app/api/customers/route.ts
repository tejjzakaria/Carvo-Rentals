/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationTemplates } from '@/lib/notifications'

// GET all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    }

    // Get total count for pagination
    const total = await prisma.customer.count({ where })

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const customers = await prisma.customer.findMany({
      where,
      include: {
        rentals: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    return NextResponse.json({
      success: true,
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      location,
      status,
      avatar
    } = body

    // Validation
    if (!name || !email || !phone || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        location,
        avatar: avatar || '',
        status: status || 'active',
        totalRentals: 0,
        totalSpent: 0
      }
    })

    // Create notification for new customer
    await NotificationTemplates.newCustomer(customer.name)

    return NextResponse.json({ success: true, customer }, { status: 201 })
  } catch (error: any) {
    console.error('Create customer error:', error)

    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
