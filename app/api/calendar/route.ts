/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all rentals for calendar view
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const vehicleId = searchParams.get('vehicleId')
    const customerId = searchParams.get('customerId')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (vehicleId) {
      where.vehicleId = vehicleId
    }

    if (customerId) {
      where.customerId = customerId
    }

    const rentals = await prisma.rental.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            category: true,
            plateNumber: true
          }
        }
      },
      orderBy: { startDate: 'asc' }
    })

    return NextResponse.json({
      success: true,
      rentals
    })
  } catch (error) {
    console.error('Get calendar rentals error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    )
  }
}
