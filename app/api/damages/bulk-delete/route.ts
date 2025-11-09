/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete damages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { damageIds } = body

    // Validation
    if (!damageIds || !Array.isArray(damageIds) || damageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Damage IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all damages with the provided IDs
    const result = await prisma.damage.deleteMany({
      where: {
        id: {
          in: damageIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} damage record(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting damages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete damage records' },
      { status: 500 }
    )
  }
}
