/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useSettings } from '@/contexts/SettingsContext'

interface Maintenance {
  id: string
  maintenanceType: string
  description: string
  cost: number
  serviceProvider: string | null
  status: string
  scheduledDate: string
  completedDate: string | null
  mileageAtService: number | null
  nextServiceDue: string | null
  notes: string | null
  vehicle: {
    id: string
    name: string
    plateNumber: string
    category: string
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

export default function MaintenancePage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [filteredMaintenances, setFilteredMaintenances] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [selectedMaintenances, setSelectedMaintenances] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
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
  }, [statusFilter, typeFilter, searchTerm])

  useEffect(() => {
    fetchMaintenances()
  }, [])

  useEffect(() => {
    filterMaintenances()
  }, [maintenances, statusFilter, typeFilter, searchTerm, currentPage])

  const fetchMaintenances = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/maintenance')
      const data = await response.json()

      if (data.success) {
        setMaintenances(data.maintenances)
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error)
      setToast({
        show: true,
        message: 'Failed to load maintenance records',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterMaintenances = () => {
    let filtered = [...maintenances]

    if (searchTerm) {
      filtered = filtered.filter(maintenance =>
        maintenance.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(maintenance => maintenance.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(maintenance => maintenance.maintenanceType === typeFilter)
    }

    // Calculate pagination
    const total = filtered.length
    const totalPages = Math.ceil(total / 10)
    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    const paginatedMaintenances = filtered.slice(startIndex, endIndex)

    setPagination({
      page: currentPage,
      limit: 10,
      total,
      totalPages
    })

    setFilteredMaintenances(paginatedMaintenances)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/maintenance/${deleteId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          show: true,
          message: 'Maintenance record deleted successfully',
          type: 'success'
        })
        fetchMaintenances()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete maintenance record',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting',
        type: 'error'
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMaintenances(filteredMaintenances.map(m => m.id))
    } else {
      setSelectedMaintenances([])
    }
  }

  const handleSelectMaintenance = (maintenanceId: string, checked: boolean) => {
    if (checked) {
      setSelectedMaintenances(prev => [...prev, maintenanceId])
    } else {
      setSelectedMaintenances(prev => prev.filter(id => id !== maintenanceId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedMaintenances.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/maintenance/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ maintenanceIds: selectedMaintenances })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: data.message || `Successfully deleted ${selectedMaintenances.length} maintenance record(s)`,
          type: 'success'
        })
        setSelectedMaintenances([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchMaintenances()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete maintenance records',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to bulk delete maintenances:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting maintenance records',
        type: 'error'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[status as keyof typeof styles] || styles.scheduled
  }

  const maintenanceTypes = Array.from(new Set(maintenances.map(m => m.maintenanceType)))

  const stats = {
    total: maintenances.length,
    scheduled: maintenances.filter(m => m.status === 'scheduled').length,
    inProgress: maintenances.filter(m => m.status === 'in_progress').length,
    completed: maintenances.filter(m => m.status === 'completed').length,
    totalCost: maintenances.reduce((sum, m) => sum + m.cost, 0),
    upcoming: maintenances.filter(m => {
      const scheduled = new Date(m.scheduledDate)
      const now = new Date()
      const week = new Date()
      week.setDate(week.getDate() + 7)
      return scheduled >= now && scheduled <= week && (m.status === 'scheduled' || m.status === 'in_progress')
    }).length
  }

  if (loading) {
    return (
      <>
        <HeaderComponent title="Maintenance Management" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading maintenance records...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HeaderComponent
          title="Maintenance Management"
          subtitle="Track and manage vehicle maintenance"
          actionButton={{
            label: "Schedule Maintenance",
            onClick: () => router.push(`${basePath}/maintenance/new`),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )
          }}
        />

        <main className='p-8'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Total Records</p>
                  <p className='text-3xl font-bold text-[#000000]'>{stats.total}</p>
                </div>
                <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Scheduled</p>
                  <p className='text-3xl font-bold text-yellow-600'>{stats.scheduled}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>In Progress</p>
                  <p className='text-3xl font-bold text-blue-600'>{stats.inProgress}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Completed</p>
                  <p className='text-3xl font-bold text-green-600'>{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Total Cost</p>
                  <p className='text-2xl font-bold text-primary'>{formatCurrency(stats.totalCost)}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Upcoming (7d)</p>
                  <p className='text-3xl font-bold text-orange-600'>{stats.upcoming}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <input
                  type='text'
                  placeholder='Search by vehicle or description...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                >
                  <option value='all'>All Statuses</option>
                  <option value='scheduled'>Scheduled</option>
                  <option value='in_progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>

              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                >
                  <option value='all'>All Types</option>
                  {maintenanceTypes.map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedMaintenances.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedMaintenances.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedMaintenances.length} maintenance record{selectedMaintenances.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedMaintenances([])}
                  className='px-4 py-2 text-gray-300 hover:text-gray-700 font-medium transition-colors'
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

          {/* Maintenance List */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left'>
                      <input
                        type='checkbox'
                        checked={selectedMaintenances.length === filteredMaintenances.length && filteredMaintenances.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                      />
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Vehicle</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Type</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Description</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Scheduled</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Cost</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredMaintenances.length === 0 ? (
                    <tr>
                      <td colSpan={8} className='px-6 py-12 text-center text-gray-500'>
                        No maintenance records found
                      </td>
                    </tr>
                  ) : (
                    filteredMaintenances.map((maintenance) => (
                      <tr key={maintenance.id} className='transition-colors'>
                        <td className='px-6 py-4'>
                          <input
                            type='checkbox'
                            checked={selectedMaintenances.includes(maintenance.id)}
                            onChange={(e) => handleSelectMaintenance(maintenance.id, e.target.checked)}
                            className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <div>
                            <p className='font-semibold text-[#000000]'>{maintenance.vehicle.name}</p>
                            <p className='text-sm text-gray-500'>{maintenance.vehicle.plateNumber}</p>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-[#000000]'>{maintenance.maintenanceType.replace('_', ' ')}</p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-[#000000] max-w-xs truncate'>{maintenance.description}</p>
                        </td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(maintenance.status)}`}>
                            {maintenance.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-gray-500'>
                            {new Date(maintenance.scheduledDate).toLocaleDateString()}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='font-semibold text-[#000000]'>{formatCurrency(maintenance.cost)}</p>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => router.push(`${basePath}/maintenance/${maintenance.id}/edit`)}
                              className='p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors'
                              title='Edit'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteId(maintenance.id)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
                <div className='text-sm text-gray-500'>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} maintenance records
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
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
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
        </main>
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Maintenance Record"
        message="Are you sure you want to delete this maintenance record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        type="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Maintenance Records"
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} maintenance record${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
      />

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
