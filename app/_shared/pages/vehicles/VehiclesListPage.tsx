/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface Vehicle {
  id: string
  name: string
  category: string
  plateNumber: string
  year: number
  seats: number
  transmission: string
  fuelType: string
  mileage: number
  price: number
  status: string
  features: string[]
  description: string | null
  images: string[]
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface VehiclesListPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function VehiclesListPage({ basePath, HeaderComponent }: VehiclesListPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; vehicleId: string | null; vehicleName: string }>({
    isOpen: false,
    vehicleId: null,
    vehicleName: ''
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
  }, [categoryFilter, searchTerm])

  useEffect(() => {
    fetchVehicles()
  }, [categoryFilter, searchTerm, currentPage])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (searchTerm) params.append('search', searchTerm)
      params.append('page', currentPage.toString())
      params.append('limit', '12')

      const response = await fetch(`/api/vehicles?${params}`)
      const data = await response.json()

      if (data.success) {
        setVehicles(data.vehicles)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      vehicleId: id,
      vehicleName: name
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVehicles(vehicles.map(v => v.id))
    } else {
      setSelectedVehicles([])
    }
  }

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    if (checked) {
      setSelectedVehicles(prev => [...prev, vehicleId])
    } else {
      setSelectedVehicles(prev => prev.filter(id => id !== vehicleId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedVehicles.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/vehicles/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleIds: selectedVehicles })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: `Successfully deleted ${selectedVehicles.length} vehicle(s)`,
          type: 'success'
        })
        setSelectedVehicles([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchVehicles()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete vehicles',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to delete vehicles:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting vehicles',
        type: 'error'
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.vehicleId) return

    try {
      const response = await fetch(`/api/vehicles/${deleteDialog.vehicleId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: 'Vehicle deleted successfully',
          type: 'success'
        })
        fetchVehicles()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete vehicle',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to delete vehicle:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting the vehicle',
        type: 'error'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rented':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    rented: vehicles.filter(v => v.status === 'rented').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length
  }

  return (
    <>
      <HeaderComponent
        title="Vehicles Management"
        subtitle="Manage your vehicle fleet"
        actionButton={{
          label: 'Add New Vehicle',
          onClick: () => router.push(`${basePath}/vehicles/new`),
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
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between mb-2'>
                <div className='w-12 h-12 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white shadow-lg'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>Total Vehicles</h3>
              <p className='text-3xl font-bold text-[#000000]'>{stats.total}</p>
            </div>

            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between mb-2'>
                <div className='w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>Available</h3>
              <p className='text-3xl font-bold text-[#000000]'>{stats.available}</p>
            </div>

            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between mb-2'>
                <div className='w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>Rented</h3>
              <p className='text-3xl font-bold text-[#000000]'>{stats.rented}</p>
            </div>

            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between mb-2'>
                <div className='w-12 h-12 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className='text-gray-500 text-sm font-medium mb-1'>Maintenance</h3>
              <p className='text-3xl font-bold text-[#000000]'>{stats.maintenance}</p>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedVehicles.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedVehicles.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedVehicles.length} vehicle{selectedVehicles.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedVehicles([])}
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
              {/* Select All Checkbox */}
              <div className='flex items-center'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={selectedVehicles.length === vehicles.length && vehicles.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                  />
                  <span className='text-sm font-medium text-gray-300'>Select All</span>
                </label>
              </div>

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
                    placeholder='Search by name or plate number...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className='flex gap-2 flex-wrap'>
                {['all', 'Luxury', 'SUV', 'Sedan', 'Electric', 'Sport'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      categoryFilter === category
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          {loading ? (
            <div className='text-center py-16'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
              <p className='text-gray-300 mt-4'>Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <h3 className='text-2xl font-bold text-gray-300 mb-2'>No vehicles found</h3>
              <p className='text-gray-500'>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className='bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all relative'>
                  {/* Select Checkbox */}
                  <div className='absolute top-4 left-4 z-10'>
                    <input
                      type='checkbox'
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={(e) => handleSelectVehicle(vehicle.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer bg-white/90 backdrop-blur-sm'
                    />
                  </div>

                  {/* Status Badge */}
                  <div className='absolute top-4 right-4 z-10'>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Vehicle Image */}
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <div className='h-48 overflow-hidden bg-gray-100 flex items-center justify-center'>
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className='w-full h-full object-contain hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                  ) : (
                    <div className='h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                  )}

                  {/* Vehicle Info */}
                  <div className='p-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20'>
                        {vehicle.category}
                      </span>
                    </div>

                    <h3 className='text-xl font-bold text-[#000000] mb-2'>{vehicle.name}</h3>

                    <div className='flex items-center gap-4 mb-4 text-xs text-gray-300'>
                      <div className='flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {vehicle.seats} Seats
                      </div>
                      <span>•</span>
                      <span>{vehicle.transmission}</span>
                      <span>•</span>
                      <span>{vehicle.fuelType}</span>
                      <span>•</span>
                      <span>{vehicle.year}</span>
                    </div>

                    <div className='flex items-center justify-between mb-4 pb-4 border-b border-gray-200'>
                      <div>
                        <p className='text-xs text-gray-500'>Plate Number</p>
                        <p className='font-semibold text-[#000000]'>{vehicle.plateNumber}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-gray-500'>Mileage</p>
                        <p className='font-semibold text-[#000000]'>{vehicle.mileage.toLocaleString()} km</p>
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-xs text-gray-500'>Price per day</p>
                        <p className='text-2xl font-bold text-primary'>{formatCurrency(vehicle.price)}</p>
                      </div>

                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => router.push(`${basePath}/vehicles/${vehicle.id}`)}
                          className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                          title='View Details'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => router.push(`${basePath}/vehicles/${vehicle.id}/edit`)}
                          className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                          title='Edit'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicle.id, vehicle.name)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                          title='Delete'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && vehicles.length > 0 && pagination.totalPages > 1 && (
            <div className='mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} vehicles
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
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, vehicleId: null, vehicleName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${deleteDialog.vehicleName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Multiple Vehicles"
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} vehicle${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
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
