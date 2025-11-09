/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete rentals
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rentalIds } = body

    // Validation
    if (!rentalIds || !Array.isArray(rentalIds) || rentalIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Rental IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all rentals with the provided IDs
    const result = await prisma.rental.deleteMany({
      where: {
        id: {
          in: rentalIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} rental(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting rentals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete rentals' },
      { status: 500 }
    )
  }
}
