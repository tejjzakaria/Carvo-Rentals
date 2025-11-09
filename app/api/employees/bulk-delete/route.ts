/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Bulk delete employees
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeIds } = body

    // Validation
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee IDs array is required' },
        { status: 400 }
      )
    }

    // Delete all employees with the provided IDs
    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: employeeIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} employee(s)`,
      deletedCount: result.count
    })
  } catch (error: any) {
    console.error('Error bulk deleting employees:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete employees' },
      { status: 500 }
    )
  }
}
