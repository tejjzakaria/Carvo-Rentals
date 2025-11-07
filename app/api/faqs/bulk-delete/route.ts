import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete FAQs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { faqIds } = body

    // Validation
    if (!faqIds || !Array.isArray(faqIds) || faqIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'FAQ IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all FAQs with the provided IDs
    const result = await prisma.fAQ.deleteMany({
      where: {
        id: {
          in: faqIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} FAQ(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting FAQs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete FAQs' },
      { status: 500 }
    )
  }
}
