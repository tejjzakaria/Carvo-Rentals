import cron from 'node-cron'
import { syncAllDataToSheets } from './googleSheets'
import { prisma } from './prisma'

// Initialize cron jobs for self-hosted deployments
export function initializeCronJobs() {
  // Only initialize cron jobs if not on Vercel (Vercel uses vercel.json cron configuration)
  if (process.env.VERCEL) {
    console.log('[CRON] Running on Vercel, skipping node-cron initialization')
    return
  }

  console.log('[CRON] Initializing backup cron job...')

  // Schedule backup every day at 2:00 AM (server time)
  // Cron format: minute hour day month day-of-week
  // '0 2 * * *' = Every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('[CRON] Starting scheduled backup at', new Date().toISOString())

      // Check if Google Sheet ID is configured
      const settings = await prisma.settings.findFirst()

      if (!settings?.googleSheetId) {
        console.log('[CRON] Google Sheet ID not configured. Skipping backup.')
        return
      }

      // Check if Google service account key is configured
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        console.log('[CRON] Google service account key not configured. Skipping backup.')
        return
      }

      // Perform the backup
      const result = await syncAllDataToSheets()
      console.log('[CRON] Backup completed successfully:', result)
    } catch (error) {
      console.error('[CRON] Backup failed:', error)
    }
  })

  console.log('[CRON] Backup cron job scheduled for 2:00 AM daily')
}
