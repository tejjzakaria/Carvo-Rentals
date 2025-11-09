'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'

export default function AdminNotFound() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-gray-50'>
      <AdminHeader />

      <div className='flex items-center justify-center py-20 px-4'>
        <div className='w-full max-w-2xl'>
          {/* Content */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center'>
            {/* 404 Number */}
            <div className='mb-6'>
              <h1 className='text-8xl sm:text-9xl font-bold bg-gradient-to-br from-primary via-primary-dark to-secondary bg-clip-text text-transparent'>
                404
              </h1>
            </div>

            {/* Icon */}
            <div className='mb-8 flex justify-center'>
              <div className='w-20 h-20 bg-red-50 rounded-full flex items-center justify-center'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              Page Not Found
            </h2>
            <p className='text-lg text-gray-600 mb-8 max-w-md mx-auto'>
              The admin page you're looking for doesn't exist or you don't have permission to access it.
            </p>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <button
                onClick={() => router.back()}
                className='w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back
              </button>
              <Link
                href="/admin/dashboard"
                className='w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </div>

            {/* Quick Links */}
            <div className='mt-10 pt-8 border-t border-gray-200'>
              <p className='text-sm text-gray-500 mb-4'>Quick Links:</p>
              <div className='flex flex-wrap items-center justify-center gap-4'>
                <Link
                  href="/admin/rentals"
                  className='text-primary hover:text-primary-dark font-medium transition-colors text-sm'
                >
                  Rentals
                </Link>
                <span className='text-gray-300'>•</span>
                <Link
                  href="/admin/vehicles"
                  className='text-primary hover:text-primary-dark font-medium transition-colors text-sm'
                >
                  Vehicles
                </Link>
                <span className='text-gray-300'>•</span>
                <Link
                  href="/admin/customers"
                  className='text-primary hover:text-primary-dark font-medium transition-colors text-sm'
                >
                  Customers
                </Link>
                <span className='text-gray-300'>•</span>
                <Link
                  href="/admin/settings"
                  className='text-primary hover:text-primary-dark font-medium transition-colors text-sm'
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
