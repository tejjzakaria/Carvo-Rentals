'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const url = filter === 'unread' ? '/api/notifications?unreadOnly=true' : '/api/notifications'
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
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

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'rental':
        return (
          <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        )
      case 'payment':
        return (
          <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'customer':
        return (
          <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )
      case 'maintenance':
        return (
          <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <AdminHeader
        title="Notifications"
        subtitle="Stay updated with all activities"
      />

      <main className='p-8'>
          {/* Filter Bar */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                    filter === 'all'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                    filter === 'unread'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className='px-6 py-2 bg-blue-50 text-primary rounded-xl font-semibold transition-all'
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200'>
            {loading ? (
              <div className='flex items-center justify-center py-20'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className='text-xl font-bold text-gray-300 mb-2'>No notifications</p>
                <p className='text-gray-500'>You're all caught up!</p>
              </div>
            ) : (
              <div className='divide-y divide-gray-200'>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className='flex items-start gap-4'>
                      {getNotificationIcon(notification.type)}

                      <div className='flex-1'>
                        <div className='flex items-start justify-between mb-2'>
                          <div>
                            <h3 className='text-base font-bold text-[#000000] mb-1'>
                              {notification.title}
                            </h3>
                            <p className='text-sm text-gray-300'>{notification.message}</p>
                          </div>
                          {!notification.read && (
                            <div className='w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 ml-2'></div>
                          )}
                        </div>

                        <div className='flex items-center gap-4 mt-3'>
                          <span className='text-xs text-gray-500'>{formatTime(notification.createdAt)}</span>

                          <div className='flex items-center gap-2'>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className='text-xs text-primary font-semibold'
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className='text-xs text-red-600 font-semibold'
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      </main>
    </>
  )
}
