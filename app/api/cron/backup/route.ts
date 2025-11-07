import { NextRequest, NextResponse } from 'next/server'
import { syncAllDataToSheets } from '@/lib/googleSheets'
import { prisma } from '@/lib/prisma'

// This endpoint is called by cron jobs to automatically backup data
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (optional security)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // If CRON_SECRET is set, verify it matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if Google Sheet ID is configured
    const settings = await prisma.settings.findFirst()

    if (!settings?.googleSheetId) {
      return NextResponse.json({
        success: false,
        message: 'Google Sheet ID not configured. Skipping backup.',
        skipped: true
      })
    }

    // Check if Google service account key is configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Google service account key not configured. Skipping backup.',
        skipped: true
      })
    }

    // Perform the backup
    console.log('[CRON] Starting automatic backup to Google Sheets...')
    const result = await syncAllDataToSheets()
    console.log('[CRON] Backup completed successfully:', result)

    return NextResponse.json({
      success: true,
      message: 'Automatic backup completed successfully',
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('[CRON] Backup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to perform automatic backup',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
