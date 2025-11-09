'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'
import RentalExtensionDialog from '@/components/RentalExtensionDialog'
import RentalPhotoUploadDialog from '@/components/RentalPhotoUploadDialog'
import { useSettings } from '@/contexts/SettingsContext'

interface Rental {
  id: string
  rentalId: string
  customerId: string
  vehicleId: string
  startDate: string
  endDate: string
  status: string
  withDriver: boolean
  insurance: boolean
  totalAmount: number
  paymentStatus: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  vehicle: {
    id: string
    name: string
    category: string
    price: number
  }
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

export default function RentalsPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rentals, setRentals] = useState<Rental[]>([])
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [selectedRentals, setSelectedRentals] = useState<string[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; rentalId: string | null; rentalNumber: string }>({
    isOpen: false,
    rentalId: null,
    rentalNumber: ''
  })
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0
  })
  const [extensionDialog, setExtensionDialog] = useState<{ isOpen: boolean; rental: Rental | null }>({
    isOpen: false,
    rental: null
  })
  const [photoUploadDialog, setPhotoUploadDialog] = useState<{
    isOpen: boolean
    rentalId: string | null
    type: 'checkIn' | 'checkOut' | null
    newStatus: string | null
  }>({
    isOpen: false,
    rentalId: null,
    type: null,
    newStatus: null
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
    fetchRentals()
  }, [])

  useEffect(() => {
    filterRentals()
  }, [rentals, statusFilter, searchTerm, currentPage])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rentals')
      const data = await response.json()

      if (data.success) {
        setRentals(data.rentals)
      }
    } catch (error) {
      console.error('Failed to fetch rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRentals = () => {
    let filtered = [...rentals]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(rental =>
        rental.rentalId.toLowerCase().includes(search) ||
        rental.customer.name.toLowerCase().includes(search) ||
        rental.customer.email.toLowerCase().includes(search) ||
        rental.vehicle.name.toLowerCase().includes(search) ||
        rental.vehicle.category.toLowerCase().includes(search)
      )
    }

    // Calculate pagination
    const total = filtered.length
    const totalPages = Math.ceil(total / 10)
    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    const paginatedRentals = filtered.slice(startIndex, endIndex)

    setPagination({
      page: currentPage,
      limit: 10,
      total,
      totalPages
    })

    setFilteredRentals(paginatedRentals)
  }

  const handleDeleteClick = (id: string, rentalNumber: string) => {
    setDeleteDialog({
      isOpen: true,
      rentalId: id,
      rentalNumber
    })
  }

  const handleExtendClick = (rental: Rental) => {
    setExtensionDialog({
      isOpen: true,
      rental
    })
  }

  const handleExtensionSuccess = () => {
    setToast({
      show: true,
      message: 'Rental extended successfully',
      type: 'success'
    })
    fetchRentals()
  }

  const handleStatusChange = async (rentalId: string, newStatus: string) => {
    // If changing to 'active', prompt for check-in photos
    if (newStatus === 'active') {
      setPhotoUploadDialog({
        isOpen: true,
        rentalId,
        type: 'checkIn',
        newStatus
      })
      return
    }

    // If changing to 'completed', prompt for check-out photos
    if (newStatus === 'completed') {
      setPhotoUploadDialog({
        isOpen: true,
        rentalId,
        type: 'checkOut',
        newStatus
      })
      return
    }

    // For other status changes, proceed normally
    try {
      const response = await fetch(`/api/rentals/${rentalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: `Rental status updated to ${newStatus}`,
          type: 'success'
        })
        fetchRentals()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to update rental status',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to update rental status:', error)
      setToast({
        show: true,
        message: 'An error occurred while updating the rental status',
        type: 'error'
      })
    }
  }

  const handlePhotoUpload = async (photos: File[]) => {
    if (!photoUploadDialog.rentalId || !photoUploadDialog.type || !photoUploadDialog.newStatus) {
      return
    }

    try {
      // Upload photos
      const formData = new FormData()
      formData.append('type', photoUploadDialog.type)
      photos.forEach((photo, index) => {
        formData.append(`photo${index}`, photo)
      })

      const uploadResponse = await fetch(`/api/rentals/${photoUploadDialog.rentalId}/photos`, {
        method: 'POST',
        body: formData
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload photos')
      }

      // Update status after successful photo upload
      const statusResponse = await fetch(`/api/rentals/${photoUploadDialog.rentalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: photoUploadDialog.newStatus })
      })

      const statusData = await statusResponse.json()

      if (statusResponse.ok) {
        setToast({
          show: true,
          message: `Photos uploaded and rental status updated to ${photoUploadDialog.newStatus}`,
          type: 'success'
        })
        fetchRentals()
        setPhotoUploadDialog({
          isOpen: false,
          rentalId: null,
          type: null,
          newStatus: null
        })
      } else {
        throw new Error(statusData.error || 'Failed to update status')
      }
    } catch (error: any) {
      console.error('Failed to upload photos:', error)
      setToast({
        show: true,
        message: error.message || 'An error occurred while uploading photos',
        type: 'error'
      })
      throw error
    }
  }

  const handlePaymentStatusChange = async (rentalId: string, newPaymentStatus: string) => {
    try {
      const response = await fetch(`/api/rentals/${rentalId}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: `Payment status updated to ${newPaymentStatus}`,
          type: 'success'
        })
        fetchRentals()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to update payment status',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to update payment status:', error)
      setToast({
        show: true,
        message: 'An error occurred while updating the payment status',
        type: 'error'
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRentals(filteredRentals.map(r => r.id))
    } else {
      setSelectedRentals([])
    }
  }

  const handleSelectRental = (rentalId: string, checked: boolean) => {
    if (checked) {
      setSelectedRentals(prev => [...prev, rentalId])
    } else {
      setSelectedRentals(prev => prev.filter(id => id !== rentalId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedRentals.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/rentals/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rentalIds: selectedRentals })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: `Successfully deleted ${selectedRentals.length} rental(s)`,
          type: 'success'
        })
        setSelectedRentals([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchRentals()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete rentals',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to delete rentals:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting rentals',
        type: 'error'
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.rentalId) return

    try {
      const response = await fetch(`/api/rentals/${deleteDialog.rentalId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: 'Rental deleted successfully',
          type: 'success'
        })
        fetchRentals()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete rental',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to delete rental:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting the rental',
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
    all: rentals.length,
    active: rentals.filter(r => r.status === 'active').length,
    pending: rentals.filter(r => r.status === 'pending').length,
    completed: rentals.filter(r => r.status === 'completed').length
  }

  return (
    <>
      <HeaderComponent
          title="Rentals Management"
          subtitle="Manage all rental bookings"
          actionButton={{
            label: 'Add New Rental',
            onClick: () => router.push(`${basePath}/rentals/new`),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )
          }}
        />

        {/* Main Content */}
        <main className='p-8'>
          {/* Bulk Actions Bar */}
          {selectedRentals.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedRentals.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedRentals.length} rental{selectedRentals.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedRentals([])}
                  className='px-4 py-2 text-gray-300 hover:bg-white rounded-lg transition-colors font-medium'
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDeleteClick}
                  className='px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center gap-2'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected
                </button>
              </div>
            </div>
          )}

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
          {loading ? (
            <div className='text-center py-16 bg-white rounded-2xl'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
              <p className='text-gray-300 mt-4'>Loading rentals...</p>
            </div>
          ) : filteredRentals.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl'>
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
          ) : (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-200'>
                      <th className='px-6 py-4 text-left'>
                        <input
                          type='checkbox'
                          checked={selectedRentals.length === filteredRentals.length && filteredRentals.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                        />
                      </th>
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
                        <td className='px-6 py-4'>
                          <input
                            type='checkbox'
                            checked={selectedRentals.includes(rental.id)}
                            onChange={(e) => handleSelectRental(rental.id, e.target.checked)}
                            className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                          />
                        </td>
                        <td className='px-6 py-4 text-sm font-semibold text-primary'>{rental.rentalId}</td>
                        <td className='px-6 py-4'>
                          <div>
                            <p className='text-sm font-medium text-[#000000]'>{rental.customer.name}</p>
                            <p className='text-xs text-gray-300'>{rental.customer.email}</p>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div>
                            <p className='text-sm text-[#000000]'>{rental.vehicle.name}</p>
                            <p className='text-xs text-gray-300'>{rental.vehicle.category}</p>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{formatDate(rental.startDate)}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{formatDate(rental.endDate)}</td>
                        <td className='px-6 py-4'>
                          <div className='relative inline-block'>
                            <select
                              value={rental.status}
                              onChange={(e) => handleStatusChange(rental.id, e.target.value)}
                              className={`appearance-none pl-3 pr-8 py-1 text-xs font-semibold rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-all ${getStatusColor(rental.status)}`}
                              style={{ minWidth: '110px' }}
                            >
                              <option value="pending">pending</option>
                              <option value="active">active</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
                              <svg className='h-3 w-3' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='relative inline-block'>
                            <select
                              value={rental.paymentStatus}
                              onChange={(e) => handlePaymentStatusChange(rental.id, e.target.value)}
                              className={`appearance-none pl-3 pr-8 py-1 text-xs font-semibold rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-all ${getPaymentStatusColor(rental.paymentStatus)}`}
                              style={{ minWidth: '100px' }}
                            >
                              <option value="pending">pending</option>
                              <option value="paid">paid</option>
                              <option value="refunded">refunded</option>
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
                              <svg className='h-3 w-3' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm font-bold text-[#000000]'>{formatCurrency(rental.totalAmount)}</td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            {/* View Button */}
                            <button
                              onClick={() => router.push(`${basePath}/rentals/${rental.id}`)}
                              className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                              title='View Details'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {/* Extend Button - Only for active/pending rentals */}
                            {(rental.status === 'active' || rental.status === 'pending') && (
                              <button
                                onClick={() => handleExtendClick(rental)}
                                className='p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
                                title='Extend Rental'
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            {/* Edit Button */}
                            <button
                              onClick={() => router.push(`${basePath}/rentals/${rental.id}/edit`)}
                              className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                              title='Edit'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(rental.id, rental.rentalId)}
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
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} rentals
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-300 hover:bg-gray-50'
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
        onClose={() => setDeleteDialog({ isOpen: false, rentalId: null, rentalNumber: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Rental"
        message={`Are you sure you want to delete rental "${deleteDialog.rentalNumber}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Multiple Rentals"
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} rental${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
      />

      {/* Extension Dialog */}
      <RentalExtensionDialog
        isOpen={extensionDialog.isOpen}
        onClose={() => setExtensionDialog({ isOpen: false, rental: null })}
        rental={extensionDialog.rental}
        onSuccess={handleExtensionSuccess}
      />

      {/* Photo Upload Dialog */}
      {photoUploadDialog.rentalId && photoUploadDialog.type && (
        <RentalPhotoUploadDialog
          isOpen={photoUploadDialog.isOpen}
          onClose={() =>
            setPhotoUploadDialog({
              isOpen: false,
              rentalId: null,
              type: null,
              newStatus: null
            })
          }
          onSubmit={handlePhotoUpload}
          type={photoUploadDialog.type}
          rentalId={photoUploadDialog.rentalId}
        />
      )}

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
