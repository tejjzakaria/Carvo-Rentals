/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'

interface NewsletterSubscription {
  id: string
  email: string
  status: string
  source: string
  subscribedAt: string
  createdAt: string
  updatedAt: string
}

export default function NewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<NewsletterSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    filterSubscriptions()
  }, [subscriptions, statusFilter, searchQuery])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/newsletter')
      const data = await response.json()

      if (data.success) {
        setSubscriptions(data.subscriptions)
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSubscriptions = () => {
    let filtered = subscriptions

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((sub) =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredSubscriptions(filtered)
  }

  const exportToCSV = () => {
    const headers = ['Email', 'Status', 'Source', 'Subscribed At']
    const rows = filteredSubscriptions.map((sub) => [
      sub.email,
      sub.status,
      sub.source,
      new Date(sub.subscribedAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === 'active').length,
    unsubscribed: subscriptions.filter((s) => s.status === 'unsubscribed').length
  }

  return (
    <>
      <AdminHeader title='Newsletter Subscribers' subtitle='Manage your newsletter subscriptions' />

      <main className='flex-1 overflow-y-auto p-6'>
        <div className=''>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-white rounded-xl border-2 border-gray-200 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-300 mb-1'>Total Subscribers</p>
                    <p className='text-3xl font-bold text-gray-300'>{stats.total}</p>
                  </div>
                  <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl border-2 border-gray-200 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-300 mb-1'>Active</p>
                    <p className='text-3xl font-bold text-green-600'>{stats.active}</p>
                  </div>
                  <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl border-2 border-gray-200 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-300 mb-1'>Unsubscribed</p>
                    <p className='text-3xl font-bold text-gray-300'>{stats.unsubscribed}</p>
                  </div>
                  <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-gray-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className='bg-white rounded-xl border-2 border-gray-200 p-6 mb-6'>
              <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
                <div className='flex-1 flex flex-col md:flex-row gap-4'>
                  {/* Search */}
                  <div className='flex-1'>
                    <input
                      type='text'
                      placeholder='Search by email...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors'
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className='px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white'
                  >
                    <option value='all'>All Status</option>
                    <option value='active'>Active</option>
                    <option value='unsubscribed'>Unsubscribed</option>
                  </select>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportToCSV}
                  className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className='bg-white rounded-xl border-2 border-gray-200 overflow-hidden'>
              {loading ? (
                <div className='p-12 text-center'>
                  <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent'></div>
                  <p className='mt-4 text-gray-300'>Loading subscribers...</p>
                </div>
              ) : filteredSubscriptions.length === 0 ? (
                <div className='p-12 text-center'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-12 w-12 text-gray-400 mx-auto mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                  <p className='text-gray-300 font-medium mb-2'>No subscribers found</p>
                  <p className='text-sm text-gray-500'>Start growing your mailing list!</p>
                </div>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-white border-b-2 border-gray-200'>
                      <tr>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                          Email
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                          Source
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
                          Subscribed At
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                              </div>
                              <span className='text-sm font-medium text-gray-300'>{subscription.email}</span>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              subscription.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {subscription.status}
                            </span>
                          </td>
                          <td className='px-6 py-4'>
                            <span className='text-sm text-gray-300 capitalize'>{subscription.source}</span>
                          </td>
                          <td className='px-6 py-4'>
                            <span className='text-sm text-gray-300'>
                              {new Date(subscription.subscribedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Results Count */}
            {!loading && filteredSubscriptions.length > 0 && (
              <div className='mt-4 text-center text-sm text-gray-300'>
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscribers
              </div>
            )}
        </div>
      </main>
    </>
  )
}
