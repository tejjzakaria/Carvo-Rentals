'use client'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          text: 'text-green-800',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          text: 'text-red-800',
          iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-800',
          iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        }
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-800',
          iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className='fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300'>
      <div className={`${styles.bg} border-2 rounded-xl shadow-xl p-4 pr-12 max-w-md`}>
        <div className='flex items-start gap-3'>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${styles.icon} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
          </svg>
          <p className={`${styles.text} font-medium text-sm`}>{message}</p>
          <button
            onClick={onClose}
            className={`${styles.icon} hover:opacity-70 transition-opacity ml-auto`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
