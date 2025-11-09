'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'

export default function NotFound() {
  const router = useRouter()

  return (
    <div>
      <Header />

      <Layout>
        <div className='min-h-screen flex items-center justify-center py-20'>
          <div className='relative w-full max-w-3xl'>
            {/* Background decoration */}
            <div className='absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl'></div>
            <div className='absolute -bottom-20 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl'></div>

            {/* Content */}
            <div className='relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-12 text-center'>
              {/* 404 Number */}
              <div className='mb-6'>
                <h1 className='text-8xl sm:text-9xl font-bold bg-gradient-to-br from-primary via-primary-dark to-secondary bg-clip-text text-transparent'>
                  404
                </h1>
              </div>

              

              {/* Message */}
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-300 mb-4'>
                Wrong Turn!
              </h2>
              <p className='text-lg text-gray-300 mb-8 max-w-md mx-auto'>
                Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
              </p>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                <button
                  onClick={() => router.back()}
                  className='w-full sm:w-auto px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </button>
                <Link
                  href="/"
                  className='w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </Link>
              </div>

              {/* Quick Links */}
              <div className='mt-12 pt-8 border-t border-gray-200'>
                <p className='text-sm text-gray-500 mb-4'>Or explore these pages:</p>
                <div className='flex flex-wrap items-center justify-center gap-4'>
                  <Link
                    href="/vehicles"
                    className='text-primary hover:text-primary-dark font-medium transition-colors'
                  >
                    Browse Vehicles
                  </Link>
                  <span className='text-gray-300'>•</span>
                  <Link
                    href="/about"
                    className='text-primary hover:text-primary-dark font-medium transition-colors'
                  >
                    About Us
                  </Link>
                  <span className='text-gray-300'>•</span>
                  <Link
                    href="/contact"
                    className='text-primary hover:text-primary-dark font-medium transition-colors'
                  >
                    Contact
                  </Link>
                  <span className='text-gray-300'>•</span>
                  <Link
                    href="/faq"
                    className='text-primary hover:text-primary-dark font-medium transition-colors'
                  >
                    FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <Footer />
    </div>
  )
}
