/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function AdminSignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== FORM SUBMITTED ===')
    console.log('Form data:', { email: formData.email, password: '***' })

    setError('')
    setIsLoading(true)

    try {
      console.log('Sending login request via NextAuth...')

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        console.error('Login error:', result.error)
        setError('Invalid email or password')
        setIsLoading(false)
      } else if (result?.ok) {
        console.log('Login successful!')
        // Get the session to determine role
        const sessionRes = await fetch('/api/auth/session')
        const sessionData = await sessionRes.json()

        console.log('Session data:', sessionData)

        // Redirect based on user role
        if (sessionData.user?.role === 'manager') {
          console.log('Redirecting to manager dashboard')
          router.push('/manager/dashboard')
        } else {
          console.log('Redirecting to admin dashboard')
          router.push('/admin/dashboard')
        }
        router.refresh()
      }
    } catch (error) {
      console.error('Login exception:', error)
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-primary via-primary-dark to-primary-light relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl'></div>

      {/* Sign In Card */}
      <div className='relative z-10 w-full max-w-md mx-4'>
        {/* Logo Section */}
        <div className='text-center mb-8'>
          <div className='inline-block bg-white rounded-2xl p-4 shadow-2xl mb-6'>
            <img src='/logos/carvo-logo-nobg.png' alt='Carvo Logo' className='w-32' />
          </div>
          <h1 className='text-4xl font-bold text-white mb-2'>Admin Portal</h1>
          <p className='text-white/80'>Sign in to manage your rentals</p>
        </div>

        {/* Sign In Form */}
        <div className='bg-white rounded-3xl shadow-2xl p-8'>
          <h2 className='text-2xl font-bold text-primary mb-6 text-center'>Welcome Back</h2>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-red-500 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span className='text-red-700 text-sm font-medium'>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email */}
            <div>
              <label className='block text-sm font-semibold text-[#000000] mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                  placeholder='Enter your email address'
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-semibold text-[#000000] mb-2'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                  placeholder='Enter your password'
                />
              </div>
            </div>

            

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className='mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl'>
            <p className='text-xs text-gray-300 text-center mb-2 font-semibold'>Demo Credentials:</p>
            <div className='space-y-2'>
              <div>
                <p className='text-xs text-gray-300 text-center font-semibold'>Admin:</p>
                <p className='text-xs text-gray-300 text-center'>Email: <span className='font-mono font-semibold'>admin@carvo.com</span></p>
                <p className='text-xs text-gray-300 text-center'>Password: <span className='font-mono font-semibold'>password123</span></p>
              </div>
              <div className='border-t border-primary/10 pt-2'>
                <p className='text-xs text-gray-300 text-center font-semibold'>Manager:</p>
                <p className='text-xs text-gray-300 text-center'>Email: <span className='font-mono font-semibold'>manager@carvo.com</span></p>
                <p className='text-xs text-gray-300 text-center'>Password: <span className='font-mono font-semibold'>password123</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className='mt-6 text-center'>
          <a href='/' className='text-white hover:text-white/80 transition-colors text-sm font-medium flex items-center justify-center gap-2'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
