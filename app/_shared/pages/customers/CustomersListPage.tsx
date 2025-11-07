'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: string
  totalRentals: number
  totalSpent: number
  avatar: string | null
  createdAt: string
  rentals?: any[]
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function CustomersPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; customerId: string | null; customerName: string }>({
    isOpen: false,
    customerId: null,
    customerName: ''
  })
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0
  })
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [statusFilter, searchTerm])

  useEffect(() => {
    fetchCustomers()
  }, [statusFilter, searchTerm, currentPage])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      params.append('page', currentPage.toString())
      params.append('limit', '10')

      const response = await fetch(`/api/customers?${params}`)
      const data = await response.json()

      if (data.success) {
        setCustomers(data.customers)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      customerId: id,
      customerName: name
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.customerId) return

    try {
      const response = await fetch(`/api/customers/${deleteDialog.customerId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: 'Customer deleted successfully',
          type: 'success'
        })
        fetchCustomers()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete customer',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to delete customer:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting the customer',
        type: 'error'
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId])
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedCustomers.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/customers/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerIds: selectedCustomers })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: data.message || `Successfully deleted ${selectedCustomers.length} customer(s)`,
          type: 'success'
        })
        setSelectedCustomers([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchCustomers()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete customers',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to bulk delete customers:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting customers',
        type: 'error'
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLastRentalDate = (customer: Customer) => {
    if (!customer.rentals || customer.rentals.length === 0) return 'Never'
    const lastRental = customer.rentals.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    return formatDate(lastRental.createdAt)
  }

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
      value: customers.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark'
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.status === 'active').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0)),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Rentals',
      value: customers.reduce((sum, c) => sum + c.totalRentals, 0),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <>
      <HeaderComponent
          title="Customers Management"
          subtitle="Manage your customer base"
          actionButton={{
            label: 'Add New Customer',
            onClick: () => router.push(`${basePath}/customers/new`),
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

          {/* Bulk Actions Bar */}
          {selectedCustomers.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedCustomers.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedCustomers([])}
                  className='px-4 py-2 text-gray-300 hover:text-gray-300 font-medium transition-colors'
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDeleteClick}
                  className='px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Customers Table */}
          {loading ? (
            <div className='text-center py-16 bg-white rounded-2xl'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
              <p className='text-gray-300 mt-4'>Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl'>
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
          ) : (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-200'>
                      <th className='px-6 py-4 text-left'>
                        <input
                          type='checkbox'
                          checked={selectedCustomers.length === customers.length && customers.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                        />
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Customer</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Contact</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Location</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Total Rentals</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Total Spent</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Joined Date</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Status</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className='px-6 py-4'>
                          <input
                            type='checkbox'
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                            className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold'>
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <p className='text-sm font-semibold text-[#000000]'>{customer.name}</p>
                              <p className='text-xs text-gray-300'>{customer.email}</p>
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
                        <td className='px-6 py-4 text-sm font-bold text-primary'>{formatCurrency(customer.totalSpent)}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{formatDate(customer.createdAt)}</td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            {/* View Button */}
                            <button
                              onClick={() => router.push(`${basePath}/customers/${customer.id}`)}
                              className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                              title='View Details'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {/* Edit Button */}
                            <button
                              onClick={() => router.push(`${basePath}/customers/${customer.id}/edit`)}
                              className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                              title='Edit'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(customer.id, customer.name)}
                              className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                              title='Delete'
                            >
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
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
                  <div className='text-sm text-gray-500'>
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-300 hover:bg-gray-50 hover:text-white'
                      }`}
                    >
                      Previous
                    </button>

                    <div className='flex items-center gap-1'>
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const pageNum = index + 1
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg transition-all ${
                                currentPage === pageNum
                                  ? 'bg-primary text-white'
                                  : 'text-gray-300 hover:bg-gray-100 hover:text-white'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <span key={pageNum} className='px-2 text-gray-400'>...</span>
                        }
                        return null
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        currentPage === pagination.totalPages
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-300 hover:bg-gray-50 hover:text-white'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, customerId: null, customerName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteDialog.customerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Customers"
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} customer${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
      />

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </>
  )
}
