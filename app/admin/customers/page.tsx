'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function CustomersPage() {
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

  const allCustomers = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+212 6 12 34 56 78',
      location: 'Casablanca, Morocco',
      totalRentals: 12,
      totalSpent: 8500,
      status: 'active',
      joinedDate: '2023-05-15',
      lastRental: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+212 6 23 45 67 89',
      location: 'Marrakech, Morocco',
      totalRentals: 8,
      totalSpent: 5200,
      status: 'active',
      joinedDate: '2023-07-20',
      lastRental: '2024-01-16'
    },
    {
      id: 3,
      name: 'Mohammed Alami',
      email: 'mohammed@example.com',
      phone: '+212 6 34 56 78 90',
      location: 'Rabat, Morocco',
      totalRentals: 15,
      totalSpent: 12000,
      status: 'active',
      joinedDate: '2023-03-10',
      lastRental: '2024-01-14'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily@example.com',
      phone: '+212 6 45 67 89 01',
      location: 'Tangier, Morocco',
      totalRentals: 3,
      totalSpent: 1800,
      status: 'inactive',
      joinedDate: '2023-11-05',
      lastRental: '2023-12-10'
    },
    {
      id: 5,
      name: 'Khalid Mansour',
      email: 'khalid@example.com',
      phone: '+212 6 56 78 90 12',
      location: 'Casablanca, Morocco',
      totalRentals: 20,
      totalSpent: 18000,
      status: 'active',
      joinedDate: '2023-01-15',
      lastRental: '2024-01-13'
    },
    {
      id: 6,
      name: 'Lisa Martinez',
      email: 'lisa@example.com',
      phone: '+212 6 67 89 01 23',
      location: 'Agadir, Morocco',
      totalRentals: 6,
      totalSpent: 4200,
      status: 'active',
      joinedDate: '2023-08-22',
      lastRental: '2024-01-10'
    },
    {
      id: 7,
      name: 'Omar Benali',
      email: 'omar@example.com',
      phone: '+212 6 78 90 12 34',
      location: 'Fes, Morocco',
      totalRentals: 2,
      totalSpent: 900,
      status: 'inactive',
      joinedDate: '2023-12-01',
      lastRental: '2023-12-15'
    },
    {
      id: 8,
      name: 'Anna Schmidt',
      email: 'anna@example.com',
      phone: '+212 6 89 01 23 45',
      location: 'Marrakech, Morocco',
      totalRentals: 10,
      totalSpent: 7500,
      status: 'active',
      joinedDate: '2023-04-18',
      lastRental: '2024-01-12'
    },
    {
      id: 9,
      name: 'Youssef Alaoui',
      email: 'youssef@example.com',
      phone: '+212 6 90 12 34 56',
      location: 'Casablanca, Morocco',
      totalRentals: 18,
      totalSpent: 15000,
      status: 'active',
      joinedDate: '2023-02-28',
      lastRental: '2024-01-18'
    },
    {
      id: 10,
      name: 'Sophie Dubois',
      email: 'sophie@example.com',
      phone: '+212 6 01 23 45 67',
      location: 'Rabat, Morocco',
      totalRentals: 5,
      totalSpent: 3000,
      status: 'active',
      joinedDate: '2023-09-10',
      lastRental: '2024-01-05'
    }
  ]

  // Filter customers
  const filteredCustomers = allCustomers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = [
    {
      title: 'Total Customers',
      value: allCustomers.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark'
    },
    {
      title: 'Active Customers',
      value: allCustomers.filter(c => c.status === 'active').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Revenue',
      value: `$${allCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Rentals',
      value: allCustomers.reduce((sum, c) => sum + c.totalRentals, 0),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className='flex h-screen bg-[#FFFFFF]'>
      <AdminSidebar activePage="Customers" />

      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        <AdminHeader
          title="Customers Management"
          subtitle="Manage your customer base"
          actionButton={{
            label: 'Add New Customer',
            onClick: () => console.log('Add new customer'),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )
          }}
        />

        <main className='p-8'>
          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className='text-gray-500 text-sm font-medium mb-1'>{stat.title}</h3>
                <p className='text-3xl font-bold text-[#000000]'>{stat.value}</p>
              </div>
            ))}
          </div>

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
                    placeholder='Search by name, email, or phone...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className='flex gap-2'>
                {['all', 'active', 'inactive'].map((status) => (
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
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Customer</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Contact</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Location</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Total Rentals</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Total Spent</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Last Rental</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold'>
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className='text-sm font-semibold text-[#000000]'>{customer.name}</p>
                            <p className='text-xs text-gray-300'>ID: {customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div>
                          <p className='text-sm text-gray-300'>{customer.email}</p>
                          <p className='text-xs text-gray-300'>{customer.phone}</p>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-300'>{customer.location}</td>
                      <td className='px-6 py-4 text-sm font-semibold text-[#000000]'>{customer.totalRentals}</td>
                      <td className='px-6 py-4 text-sm font-bold text-primary'>${customer.totalSpent.toLocaleString()}</td>
                      <td className='px-6 py-4 text-sm text-gray-300'>{customer.lastRental}</td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
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
              {filteredCustomers.length === 0 && (
                <div className='text-center py-16'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className='text-2xl font-bold text-gray-300 mb-2'>No customers found</h3>
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
