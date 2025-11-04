'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function RentalsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  const allRentals = [
    {
      id: 'RNT-001',
      customer: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+212 6 12 34 56 78',
      vehicle: 'Mercedes-Benz S-Class',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'active',
      total: '$2,250',
      paymentStatus: 'paid'
    },
    {
      id: 'RNT-002',
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+212 6 23 45 67 89',
      vehicle: 'BMW X5',
      startDate: '2024-01-16',
      endDate: '2024-01-18',
      status: 'active',
      total: '$760',
      paymentStatus: 'paid'
    },
    {
      id: 'RNT-003',
      customer: 'Mohammed Alami',
      email: 'mohammed@example.com',
      phone: '+212 6 34 56 78 90',
      vehicle: 'Toyota Camry',
      startDate: '2024-01-14',
      endDate: '2024-01-21',
      status: 'completed',
      total: '$1,260',
      paymentStatus: 'paid'
    },
    {
      id: 'RNT-004',
      customer: 'Emily Chen',
      email: 'emily@example.com',
      phone: '+212 6 45 67 89 01',
      vehicle: 'Tesla Model 3',
      startDate: '2024-01-17',
      endDate: '2024-01-19',
      status: 'pending',
      total: '$560',
      paymentStatus: 'pending'
    },
    {
      id: 'RNT-005',
      customer: 'Khalid Mansour',
      email: 'khalid@example.com',
      phone: '+212 6 56 78 90 12',
      vehicle: 'Range Rover Sport',
      startDate: '2024-01-13',
      endDate: '2024-01-20',
      status: 'active',
      total: '$3,640',
      paymentStatus: 'paid'
    },
    {
      id: 'RNT-006',
      customer: 'Lisa Martinez',
      email: 'lisa@example.com',
      phone: '+212 6 67 89 01 23',
      vehicle: 'Audi A6',
      startDate: '2024-01-10',
      endDate: '2024-01-15',
      status: 'completed',
      total: '$2,000',
      paymentStatus: 'paid'
    },
    {
      id: 'RNT-007',
      customer: 'Omar Benali',
      email: 'omar@example.com',
      phone: '+212 6 78 90 12 34',
      vehicle: 'Nissan Patrol',
      startDate: '2024-01-18',
      endDate: '2024-01-22',
      status: 'pending',
      total: '$1,280',
      paymentStatus: 'pending'
    },
    {
      id: 'RNT-008',
      customer: 'Anna Schmidt',
      email: 'anna@example.com',
      phone: '+212 6 89 01 23 45',
      vehicle: 'Honda Accord',
      startDate: '2024-01-12',
      endDate: '2024-01-17',
      status: 'completed',
      total: '$800',
      paymentStatus: 'paid'
    }
  ]

  // Filter rentals
  const filteredRentals = allRentals.filter(rental => {
    const matchesSearch =
      rental.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const statusCounts = {
    all: allRentals.length,
    active: allRentals.filter(r => r.status === 'active').length,
    pending: allRentals.filter(r => r.status === 'pending').length,
    completed: allRentals.filter(r => r.status === 'completed').length
  }

  return (
    <div className='flex h-screen bg-[#FFFFFF]'>
      <AdminSidebar activePage="Rentals" />

      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        {/* Top Bar */}
        <AdminHeader
          title="Rentals Management"
          subtitle="Manage all rental bookings"
          actionButton={{
            label: 'Add New Rental',
            onClick: () => router.push('/admin/rentals/new'),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )
          }}
        />

        {/* Main Content */}
        <main className='p-8'>
          {/* Filters */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6'>
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Search */}
              <div className='flex-1'>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type='text'
                    placeholder='Search by ID, customer, or vehicle...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                  />
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div className='flex gap-2'>
                {['all', 'active', 'pending', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      statusFilter === status
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <span className='ml-2 text-xs'>({statusCounts[status as keyof typeof statusCounts]})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rentals Table */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Rental ID</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Customer</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Vehicle</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Start Date</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>End Date</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Payment</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Total</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredRentals.map((rental) => (
                    <tr key={rental.id}>
                      <td className='px-6 py-4 text-sm font-semibold text-primary'>{rental.id}</td>
                      <td className='px-6 py-4'>
                        <div>
                          <p className='text-sm font-medium text-[#000000]'>{rental.customer}</p>
                          <p className='text-xs text-gray-300'>{rental.email}</p>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-300'>{rental.vehicle}</td>
                      <td className='px-6 py-4 text-sm text-gray-300'>{rental.startDate}</td>
                      <td className='px-6 py-4 text-sm text-gray-300'>{rental.endDate}</td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(rental.status)}`}>
                          {rental.status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentStatusColor(rental.paymentStatus)}`}>
                          {rental.paymentStatus}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm font-bold text-[#000000]'>{rental.total}</td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {/* View Button */}
                          <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors' title='View Details'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {/* Edit Button */}
                          <button className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors' title='Edit'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Delete Button */}
                          <button className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors' title='Delete'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* No Results */}
              {filteredRentals.length === 0 && (
                <div className='text-center py-16'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className='text-2xl font-bold text-gray-300 mb-2'>No rentals found</h3>
                  <p className='text-gray-500 mb-6'>Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                    }}
                    className='px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all'
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
