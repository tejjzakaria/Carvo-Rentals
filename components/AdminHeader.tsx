'use client'
import { useState, useRef, useEffect } from 'react'

interface AdminHeaderProps {
  title: string
  subtitle: string
  actionButton?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
}

export default function AdminHeader({ title, subtitle, actionButton }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const notifications = [
    {
      id: 1,
      type: 'rental',
      title: 'New Rental Booking',
      message: 'Ahmed Hassan booked Mercedes-Benz S-Class',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $2,250 received from Sarah Johnson',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'rental',
      title: 'Rental Completed',
      message: 'Mohammed Alami completed rental for Toyota Camry',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'customer',
      title: 'New Customer',
      message: 'Emily Chen registered as a new customer',
      time: '5 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'maintenance',
      title: 'Maintenance Alert',
      message: 'BMW X5 requires scheduled maintenance',
      time: '1 day ago',
      read: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'rental':
        return (
          <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        )
      case 'payment':
        return (
          <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'customer':
        return (
          <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )
      case 'maintenance':
        return (
          <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <header className='bg-white border-b border-gray-200 px-8 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-[#000000]'>{title}</h1>
          <p className='text-gray-500 text-sm'>{subtitle}</p>
        </div>
        <div className='flex items-center gap-4'>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className='px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2'
            >
              {actionButton.icon}
              {actionButton.label}
            </button>
          )}

          {/* Notifications */}
          <div className='relative' ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className='relative p-2 rounded-lg transition-colors'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className='absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden'>
                {/* Header */}
                <div className='px-6 py-4 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-bold text-[#000000]'>Notifications</h3>
                    {unreadCount > 0 && (
                      <span className='px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full'>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className='max-h-[400px] overflow-y-auto'>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 border-b border-gray-200 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className='flex items-start gap-3'>
                        {getNotificationIcon(notification.type)}
                        <div className='flex-1'>
                          <p className='text-sm font-semibold text-[#000000] mb-1'>{notification.title}</p>
                          <p className='text-xs text-gray-300 mb-2'>{notification.message}</p>
                          <p className='text-xs text-gray-500'>{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
            <div className='w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold'>
              A
            </div>
            <div className='text-left'>
              <p className='text-sm font-semibold text-[#000000]'>Admin User</p>
              <p className='text-xs text-gray-500'>Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
