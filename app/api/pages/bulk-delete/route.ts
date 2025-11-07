import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete pages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageIds } = body

    // Validation
    if (!pageIds || !Array.isArray(pageIds) || pageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Page IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all pages with the provided IDs
    const result = await prisma.page.deleteMany({
      where: {
        id: {
          in: pageIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} page(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete pages' },
      { status: 500 }
    )
  }
}
