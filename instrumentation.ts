// This file is used to initialize services when the app starts
// For more info: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize cron jobs for scheduled backups
    const { initializeCronJobs } = await import('./lib/cron')
    initializeCronJobs()
  }
}
