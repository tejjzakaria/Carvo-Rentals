/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete maintenance records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { maintenanceIds } = body

    // Validation
    if (!maintenanceIds || !Array.isArray(maintenanceIds) || maintenanceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Maintenance IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all maintenance records with the provided IDs
    const result = await prisma.maintenance.deleteMany({
      where: {
        id: {
          in: maintenanceIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} maintenance record(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting maintenance records:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete maintenance records' },
      { status: 500 }
    )
  }
}
