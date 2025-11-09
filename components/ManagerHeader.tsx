/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

interface ManagerHeaderProps {
  title?: string
  subtitle?: string
  actionButton?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
}

export default function ManagerHeader({ title, subtitle, actionButton }: ManagerHeaderProps) {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [managerProfile, setManagerProfile] = useState<{ name: string; role: string; avatar: string | null } | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Fetch manager profile
  useEffect(() => {
    fetchManagerProfile()
  }, [])

  const fetchManagerProfile = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      if (data.user) {
        setManagerProfile({
          name: data.user.name,
          role: 'Manager',
          avatar: null
        })
      }
    } catch (error) {
      console.error('Error fetching manager profile:', error)
    }
  }

  // Fetch notifications
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
    }
  }, [showNotifications])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10')
      const data = await response.json()
      if (data.success) {
        // Filter to only show operational notifications for managers
        const operationalNotifications = data.notifications.filter((n: Notification) =>
          ['rental', 'customer', 'maintenance'].includes(n.type)
        )
        setNotifications(operationalNotifications)
        setUnreadCount(operationalNotifications.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH'
      })
      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH'
      })
      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

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
    <>
      {/* Beta Disclaimer Banner */}
      <div className='bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 px-8 py-2'>
        <div className='flex items-center justify-center gap-2 text-sm'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className='text-yellow-800 font-medium'>
            <span className='font-bold'>BETA VERSION:</span> This platform is currently in beta and may encounter technical issues. Thank you for your patience.
          </span>
        </div>
      </div>

      <header className='bg-white border-b border-gray-200 px-8 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            {title && <h1 className='text-2xl font-bold text-[#000000]'>{title}</h1>}
            {subtitle && <p className='text-gray-500 text-sm'>{subtitle}</p>}
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
              className='relative p-2 rounded-lg hover:bg-gray-100 transition-colors'
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
                    <div className='flex items-center gap-2'>
                      {unreadCount > 0 && (
                        <>
                          <span className='px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full'>
                            {unreadCount} new
                          </span>
                          <button
                            onClick={handleMarkAllAsRead}
                            className='text-xs text-primary font-semibold hover:underline'
                          >
                            Mark all read
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className='max-h-[400px] overflow-y-auto'>
                  {notifications.length === 0 ? (
                    <div className='px-6 py-8 text-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className='text-gray-500 text-sm'>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                        className={`px-6 py-4 border-b border-gray-200 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          {getNotificationIcon(notification.type)}
                          <div className='flex-1'>
                            <p className='text-sm font-semibold text-[#000000] mb-1'>{notification.title}</p>
                            <p className='text-xs text-gray-300 mb-2'>{notification.message}</p>
                            <p className='text-xs text-gray-500'>{formatTime(notification.createdAt)}</p>
                          </div>
                          {!notification.read && (
                            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
              {managerProfile?.name ? managerProfile.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className='text-left'>
              <p className='text-sm font-semibold text-[#000000]'>{managerProfile?.name || 'Manager'}</p>
              <p className='text-xs text-gray-500'>{managerProfile?.role || 'Manager'}</p>
            </div>
          </div>
        </div>
      </div>
      </header>
    </>
  )
}
