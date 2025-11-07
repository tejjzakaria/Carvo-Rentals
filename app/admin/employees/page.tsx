'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'
import ConfirmDialog from '@/components/ConfirmDialog'
import Toast from '@/components/Toast'

interface Employee {
  id: string
  name: string
  email: string
  role: string
  phone: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export default function EmployeesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; employeeId: string | null; employeeName: string }>({
    isOpen: false,
    employeeId: null,
    employeeName: ''
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
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [roleFilter, searchTerm])

  useEffect(() => {
    fetchEmployees()
  }, [roleFilter, searchTerm, currentPage])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/admin/profile')
      const data = await response.json()
      if (data.success) {
        setCurrentUserId(data.data.id)
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (searchTerm) params.append('search', searchTerm)
      params.append('page', currentPage.toString())
      params.append('limit', '10')

      const response = await fetch(`/api/employees?${params}`)
      const data = await response.json()

      if (data.success) {
        setEmployees(data.employees)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string, name: string) => {
    // Prevent self-deletion
    if (id === currentUserId) {
      setToast({
        show: true,
        message: 'You cannot delete your own account',
        type: 'error'
      })
      return
    }

    setDeleteDialog({
      isOpen: true,
      employeeId: id,
      employeeName: name
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.employeeId) return

    try {
      const response = await fetch(`/api/employees/${deleteDialog.employeeId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: 'Employee deleted successfully',
          type: 'success'
        })
        fetchEmployees()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete employee',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to delete employee:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting the employee',
        type: 'error'
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all employees except the current user
      setSelectedEmployees(employees.filter(e => e.id !== currentUserId).map(e => e.id))
    } else {
      setSelectedEmployees([])
    }
  }

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId])
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedEmployees.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/employees/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employeeIds: selectedEmployees })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({
          show: true,
          message: data.message || `Successfully deleted ${selectedEmployees.length} employee(s)`,
          type: 'success'
        })
        setSelectedEmployees([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchEmployees()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete employees',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Failed to bulk delete employees:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting employees',
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

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'employee':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'support':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-primary to-primary-dark'
    },
    {
      title: 'Admins',
      value: employees.filter(e => e.role === 'admin').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Managers',
      value: employees.filter(e => e.role === 'manager').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Support Staff',
      value: employees.filter(e => e.role === 'support').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  return (
    <>
      <AdminHeader
        title="Employee Management"
        subtitle="Manage your team members and their roles"
        actionButton={{
          label: 'Add New Employee',
          onClick: () => router.push('/admin/employees/new'),
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

              {/* Role Filter */}
              <div className='flex gap-2 flex-wrap'>
                {['all', 'admin', 'manager', 'employee', 'support'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      roleFilter === role
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedEmployees.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedEmployees.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedEmployees([])}
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

          {/* Employees Table */}
          {loading ? (
            <div className='text-center py-16 bg-white rounded-2xl'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
              <p className='text-gray-300 mt-4'>Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-2xl'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className='text-2xl font-bold text-gray-300 mb-2'>No employees found</h3>
              <p className='text-gray-500 mb-6'>Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('all')
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
                          checked={selectedEmployees.length === employees.filter(e => e.id !== currentUserId).length && employees.filter(e => e.id !== currentUserId).length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                        />
                      </th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Employee</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Email</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Phone</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Role</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Joined Date</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className='px-6 py-4'>
                          <input
                            type='checkbox'
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={(e) => handleSelectEmployee(employee.id, e.target.checked)}
                            disabled={employee.id === currentUserId}
                            className={`w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary ${
                              employee.id === currentUserId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            {employee.avatar ? (
                              <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-primary'>
                                <img
                                  src={employee.avatar}
                                  alt={employee.name}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            ) : (
                              <div className='w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold'>
                                {employee.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className='text-sm font-semibold text-[#000000]'>{employee.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{employee.email}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{employee.phone || 'N/A'}</td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(employee.role)}`}>
                            {employee.role}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{formatDate(employee.createdAt)}</td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            {/* Edit Button */}
                            <button
                              onClick={() => router.push(`/admin/employees/${employee.id}/edit`)}
                              className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                              title='Edit'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteClick(employee.id, employee.name)}
                              disabled={employee.id === currentUserId}
                              className={`p-2 rounded-lg transition-colors ${
                                employee.id === currentUserId
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                              title={employee.id === currentUserId ? 'You cannot delete your own account' : 'Delete'}
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
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} employees
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
                                  : 'text-gray-700 hover:bg-gray-100'
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
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
        onClose={() => setDeleteDialog({ isOpen: false, employeeId: null, employeeName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteDialog.employeeName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title="Bulk Delete Employees"
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} employee${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
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
