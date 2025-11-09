/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncAllDataToSheets, verifyConnection } from '@/lib/googleSheets'

// POST - Sync all data to Google Sheets
export async function POST(request: NextRequest) {
  try {
    const result = await syncAllDataToSheets()

    return NextResponse.json({
      success: true,
      message: 'Data synced successfully',
      data: result,
    })
  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync data to Google Sheets',
      },
      { status: 500 }
    )
  }
}

// GET - Verify connection
export async function GET(request: NextRequest) {
  try {
    const result = await verifyConnection()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify Google Sheets connection',
      },
      { status: 500 }
    )
  }
}
