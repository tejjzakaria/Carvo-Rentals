/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete customers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerIds } = body

    // Validation
    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all customers with the provided IDs
    const result = await prisma.customer.deleteMany({
      where: {
        id: {
          in: customerIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} customer(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete customers' },
      { status: 500 }
    )
  }
}
