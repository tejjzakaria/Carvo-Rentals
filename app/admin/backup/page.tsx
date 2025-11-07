'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'

interface SyncResult {
  vehiclesCount: number
  customersCount: number
  rentalsCount: number
  timestamp: string
}

export default function BackupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [lastSync, setLastSync] = useState<SyncResult | null>(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  useEffect(() => {
    verifyConnection()
  }, [])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  const verifyConnection = async () => {
    setVerifying(true)
    try {
      const response = await fetch('/api/backup/sync')
      const result = await response.json()
      setConnectionStatus(result)
    } catch (error) {
      console.error('Verification error:', error)
      setConnectionStatus({
        success: false,
        error: 'Failed to connect to backup service',
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleSync = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/backup/sync', {
        method: 'POST',
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setLastSync(result.data)
        setToast({
          show: true,
          message: `Successfully synced ${result.data.vehiclesCount} vehicles, ${result.data.customersCount} customers, and ${result.data.rentalsCount} rentals!`,
          type: 'success',
        })
      } else {
        setToast({
          show: true,
          message: result.error || 'Failed to sync data',
          type: 'error',
        })
      }
    } catch (error) {
      console.error('Sync error:', error)
      setToast({
        show: true,
        message: 'Failed to sync data to Google Sheets',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="Data Backup"
        subtitle="Backup your data to Google Sheets"
      />

      <main className='p-8'>
          {/* Connection Status */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-[#000000]'>Connection Status</h2>
              <button
                onClick={verifyConnection}
                disabled={verifying}
                className='px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold disabled:opacity-50'
              >
                {verifying ? 'Checking...' : 'Check Connection'}
              </button>
            </div>

            {verifying ? (
              <div className='flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
                <p className='text-sm text-blue-800'>Verifying connection...</p>
              </div>
            ) : connectionStatus?.success ? (
              <div className='space-y-4'>
                <div className='flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold text-green-800'>Connected to Google Sheets</p>
                    <p className='text-xs text-green-600 mt-1'>
                      Spreadsheet: {connectionStatus.spreadsheetTitle}
                    </p>
                  </div>
                </div>

                {connectionStatus.spreadsheetUrl && (
                  <a
                    href={connectionStatus.spreadsheetUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold text-sm'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Google Sheet
                  </a>
                )}
              </div>
            ) : (
              <div className='p-4 bg-red-50 border border-red-200 rounded-xl'>
                <div className='flex items-start gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className='text-sm font-semibold text-red-800'>Connection Failed</p>
                    <p className='text-xs text-red-600 mt-1'>
                      {connectionStatus?.error || 'Unable to connect to Google Sheets'}
                    </p>
                    <p className='text-xs text-red-600 mt-2'>
                      Please check your Google Sheets configuration in the .env file
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sync Action */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <h2 className='text-2xl font-bold text-[#000000] mb-2'>Manual Backup</h2>
            <p className='text-gray-300 mb-6'>
              Backup all data (vehicles, customers, and rentals) to Google Sheets
            </p>

            <button
              onClick={handleSync}
              disabled={loading || !connectionStatus?.success}
              className='px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3'
            >
              {loading ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  <span>Syncing Data...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Backup Now</span>
                </>
              )}
            </button>
          </div>

          {/* Last Sync Info */}
          {lastSync && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 className='text-2xl font-bold text-[#000000] mb-6'>Last Backup</h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <div className='p-6 bg-blue-50 border border-blue-200 rounded-xl'>
                  <div className='flex items-center gap-3 mb-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <h3 className='text-lg font-bold text-blue-800'>Vehicles</h3>
                  </div>
                  <p className='text-3xl font-bold text-blue-600'>{lastSync.vehiclesCount}</p>
                  <p className='text-xs text-blue-600 mt-1'>records synced</p>
                </div>

                <div className='p-6 bg-green-50 border border-green-200 rounded-xl'>
                  <div className='flex items-center gap-3 mb-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className='text-lg font-bold text-green-800'>Customers</h3>
                  </div>
                  <p className='text-3xl font-bold text-green-600'>{lastSync.customersCount}</p>
                  <p className='text-xs text-green-600 mt-1'>records synced</p>
                </div>

                <div className='p-6 bg-purple-50 border border-purple-200 rounded-xl'>
                  <div className='flex items-center gap-3 mb-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className='text-lg font-bold text-purple-800'>Rentals</h3>
                  </div>
                  <p className='text-3xl font-bold text-purple-600'>{lastSync.rentalsCount}</p>
                  <p className='text-xs text-purple-600 mt-1'>records synced</p>
                </div>
              </div>

              <div className='text-center text-sm text-gray-300'>
                <p>
                  Last synced at:{' '}
                  <span className='font-semibold text-[#000000]'>
                    {new Date(lastSync.timestamp).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          <div className='mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6'>
            <div className='flex items-start gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-blue-800 mb-2'>Setup Required</p>
                <p className='text-xs text-blue-600'>
                  To use this feature, you need to set up Google Sheets API credentials.
                  Check the GOOGLE_SHEETS_SETUP.md
                </p>
              </div>
            </div>
          </div>
      </main>

      {/* Toast Notification */}
      {toast.show && (
        <div className='fixed bottom-8 right-8 z-50 animate-slide-up'>
          <div
            className={`px-6 py-4 rounded-xl shadow-lg border-2 ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className='flex items-center gap-3'>
              {toast.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className='font-semibold text-sm'>{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
