/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete vehicles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleIds } = body

    // Validation
    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vehicle IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all vehicles with the provided IDs
    const result = await prisma.vehicle.deleteMany({
      where: {
        id: {
          in: vehicleIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} vehicle(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete vehicles' },
      { status: 500 }
    )
  }
}
