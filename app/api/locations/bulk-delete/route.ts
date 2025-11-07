import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete locations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locationIds } = body

    // Validation
    if (!locationIds || !Array.isArray(locationIds) || locationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Location IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all locations with the provided IDs
    const result = await prisma.location.deleteMany({
      where: {
        id: {
          in: locationIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} location(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting locations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete locations' },
      { status: 500 }
    )
  }
}
