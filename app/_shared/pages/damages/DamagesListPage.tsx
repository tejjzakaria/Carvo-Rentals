'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useSettings } from '@/contexts/SettingsContext'

interface Damage {
  id: string
  severity: string
  description: string
  repairCost: number
  insuranceClaim: boolean
  claimAmount: number | null
  status: string
  images: string[]
  reportedDate: string
  repairedDate: string | null
  vehicle: {
    id: string
    name: string
    plateNumber: string
    category: string
  }
  rental: {
    id: string
    rentalId: string
    customer: {
      name: string
      email: string
    }
  } | null
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

export default function DamagesPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [damages, setDamages] = useState<Damage[]>([])
  const [filteredDamages, setFilteredDamages] = useState<Damage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [selectedDamages, setSelectedDamages] = useState<string[]>([])
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
  }, [statusFilter, severityFilter, searchTerm])

  useEffect(() => {
    fetchDamages()
  }, [])

  useEffect(() => {
    filterDamages()
  }, [damages, statusFilter, severityFilter, searchTerm, currentPage])

  const fetchDamages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/damages')
      const data = await response.json()

      if (data.success) {
        setDamages(data.damages)
      }
    } catch (error) {
      console.error('Error fetching damages:', error)
      setToast({
        show: true,
        message: 'Failed to load damages',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterDamages = () => {
    let filtered = [...damages]

    if (searchTerm) {
      filtered = filtered.filter(damage =>
        damage.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        damage.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        damage.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(damage => damage.status === statusFilter)
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(damage => damage.severity === severityFilter)
    }

    // Calculate pagination
    const total = filtered.length
    const totalPages = Math.ceil(total / 10)
    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    const paginatedDamages = filtered.slice(startIndex, endIndex)

    setPagination({
      page: currentPage,
      limit: 10,
      total,
      totalPages
    })

    setFilteredDamages(paginatedDamages)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/damages/${deleteId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          show: true,
          message: 'Damage deleted successfully',
          type: 'success'
        })
        fetchDamages()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete damage',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting damage:', error)
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
      setSelectedDamages(filteredDamages.map(d => d.id))
    } else {
      setSelectedDamages([])
    }
  }

  const handleSelectDamage = (damageId: string, checked: boolean) => {
    if (checked) {
      setSelectedDamages(prev => [...prev, damageId])
    } else {
      setSelectedDamages(prev => prev.filter(id => id !== damageId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedDamages.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/damages/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ damageIds: selectedDamages })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: data.message || `Successfully deleted ${selectedDamages.length} damage record(s)`,
          type: 'success'
        })
        setSelectedDamages([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchDamages()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete damage records',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to bulk delete damages:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting damage records',
        type: 'error'
      })
    }
  }

  const getSeverityBadge = (severity: string) => {
    const styles = {
      minor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      moderate: 'bg-orange-100 text-orange-800 border-orange-200',
      severe: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[severity as keyof typeof styles] || styles.minor
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      reported: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_repair: 'bg-blue-100 text-blue-800 border-blue-200',
      repaired: 'bg-green-100 text-green-800 border-green-200'
    }
    return styles[status as keyof typeof styles] || styles.reported
  }

  const stats = {
    total: damages.length,
    reported: damages.filter(d => d.status === 'reported').length,
    inRepair: damages.filter(d => d.status === 'in_repair').length,
    repaired: damages.filter(d => d.status === 'repaired').length,
    totalCost: damages.reduce((sum, d) => sum + d.repairCost, 0),
    insuranceClaims: damages.filter(d => d.insuranceClaim).length
  }

  if (loading) {
    return (
      <>
        <HeaderComponent title="Damage Management" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading damages...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HeaderComponent
          title="Damage Management"
          subtitle="Track and manage vehicle damages"
          actionButton={{
            label: "Report Damage",
            onClick: () => router.push(`${basePath}/damages/new`),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                  <p className='text-sm text-gray-500 mb-1'>Total Damages</p>
                  <p className='text-3xl font-bold text-[#000000]'>{stats.total}</p>
                </div>
                <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Reported</p>
                  <p className='text-3xl font-bold text-yellow-600'>{stats.reported}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>In Repair</p>
                  <p className='text-3xl font-bold text-blue-600'>{stats.inRepair}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Repaired</p>
                  <p className='text-3xl font-bold text-green-600'>{stats.repaired}</p>
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
                  <p className='text-sm text-gray-500 mb-1'>Insurance Claims</p>
                  <p className='text-3xl font-bold text-[#000000]'>{stats.insuranceClaims}</p>
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
                  <option value='reported'>Reported</option>
                  <option value='in_repair'>In Repair</option>
                  <option value='repaired'>Repaired</option>
                </select>
              </div>

              <div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                >
                  <option value='all'>All Severities</option>
                  <option value='minor'>Minor</option>
                  <option value='moderate'>Moderate</option>
                  <option value='severe'>Severe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedDamages.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedDamages.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedDamages.length} damage record{selectedDamages.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedDamages([])}
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

          {/* Damages List */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left'>
                      <input
                        type='checkbox'
                        checked={selectedDamages.length === filteredDamages.length && filteredDamages.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                      />
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Vehicle</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Description</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Severity</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Cost</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Reported</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredDamages.length === 0 ? (
                    <tr>
                      <td colSpan={8} className='px-6 py-12 text-center text-gray-500'>
                        No damages found
                      </td>
                    </tr>
                  ) : (
                    filteredDamages.map((damage) => (
                      <tr key={damage.id} className='transition-colors'>
                        <td className='px-6 py-4'>
                          <input
                            type='checkbox'
                            checked={selectedDamages.includes(damage.id)}
                            onChange={(e) => handleSelectDamage(damage.id, e.target.checked)}
                            className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <div>
                            <p className='font-semibold text-[#000000]'>{damage.vehicle.name}</p>
                            <p className='text-sm text-gray-500'>{damage.vehicle.plateNumber}</p>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-[#000000] max-w-xs truncate'>{damage.description}</p>
                        </td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getSeverityBadge(damage.severity)}`}>
                            {damage.severity}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(damage.status)}`}>
                            {damage.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <p className='font-semibold text-[#000000]'>{formatCurrency(damage.repairCost)}</p>
                          {damage.insuranceClaim && (
                            <p className='text-xs text-blue-600'>Insurance Claim</p>
                          )}
                        </td>
                        <td className='px-6 py-4'>
                          <p className='text-sm text-gray-500'>
                            {new Date(damage.reportedDate).toLocaleDateString()}
                          </p>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => router.push(`${basePath}/damages/${damage.id}/edit`)}
                              className='p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors'
                              title='Edit'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteId(damage.id)}
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
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} damages
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
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Damage"
        message="Are you sure you want to delete this damage record? This action cannot be undone."
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
        title="Bulk Delete Damages"
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} damage record${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
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
