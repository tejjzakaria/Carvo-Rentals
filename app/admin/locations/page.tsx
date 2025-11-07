'use client'
import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface Location {
  id: string
  name: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    order: 0,
    isActive: true
  })
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null)
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{ isOpen: boolean; count: number }>({
    isOpen: false,
    count: 0
  })
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations')
      const data = await res.json()
      if (data.success) {
        setLocations(data.locations)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      showToast('Failed to fetch locations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/locations/${editingId}` : '/api/locations'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        showToast(
          editingId ? 'Location updated successfully!' : 'Location created successfully!',
          'success'
        )
        fetchLocations()
        resetForm()
      } else {
        showToast(data.error || 'Failed to save location', 'error')
      }
    } catch (error) {
      console.error('Error saving location:', error)
      showToast('Failed to save location', 'error')
    }
  }

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      order: location.order,
      isActive: location.isActive
    })
    setEditingId(location.id)
    setShowForm(true)
  }

  const handleDeleteClick = (id: string) => {
    setLocationToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!locationToDelete) return

    try {
      const response = await fetch(`/api/locations/${locationToDelete}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showToast('Location deleted successfully!', 'success')
        fetchLocations()
      } else {
        const data = await response.json()
        showToast(data.error || 'Failed to delete location', 'error')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      showToast('Failed to delete location', 'error')
    } finally {
      setDeleteConfirmOpen(false)
      setLocationToDelete(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLocations(locations.map(l => l.id))
    } else {
      setSelectedLocations([])
    }
  }

  const handleSelectLocation = (locationId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations(prev => [...prev, locationId])
    } else {
      setSelectedLocations(prev => prev.filter(id => id !== locationId))
    }
  }

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialog({
      isOpen: true,
      count: selectedLocations.length
    })
  }

  const handleBulkDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/locations/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ locationIds: selectedLocations })
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message || `Successfully deleted ${selectedLocations.length} location(s)`, 'success')
        setSelectedLocations([])
        setBulkDeleteDialog({ isOpen: false, count: 0 })
        fetchLocations()
      } else {
        showToast(data.error || 'Failed to delete locations', 'error')
      }
    } catch (error) {
      console.error('Failed to bulk delete locations:', error)
      showToast('An error occurred while deleting locations', 'error')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      order: 0,
      isActive: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <>
      <AdminHeader title='Rental Locations' subtitle='Manage pickup and return locations' />

      <main className='flex-1 overflow-y-auto p-6'>
          {/* Header with Add Button */}
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-[#000000]'>Manage Locations</h2>
              <p className='text-gray-500 mt-1'>Add and manage rental/return locations</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Location
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-2xl p-6 w-full max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-xl font-bold text-[#000000]'>
                    {editingId ? 'Edit Location' : 'Add New Location'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Location Name *
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                      placeholder='e.g., Casablanca City Center'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Display Order
                    </label>
                    <input
                      type='number'
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
                      min='0'
                    />
                  </div>

                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      id='isActive'
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                    <label htmlFor='isActive' className='text-sm font-medium text-[#000000]'>
                      Show on website
                    </label>
                  </div>

                  <div className='flex gap-3 pt-4'>
                    <button
                      type='button'
                      onClick={resetForm}
                      className='flex-1 px-4 py-2 border-2 border-gray-200 text-gray-200 rounded-lg hover:bg-gray-50 hover:text-white transition-colors'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors'
                    >
                      {editingId ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Bulk Actions Bar */}
          {selectedLocations.length > 0 && (
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold'>
                  {selectedLocations.length}
                </div>
                <span className='text-gray-300 font-medium'>
                  {selectedLocations.length} location{selectedLocations.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => setSelectedLocations([])}
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

          {/* Locations Table */}
          {loading ? (
            <div className='text-center py-12'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary'></div>
              <p className='mt-4 text-lg text-gray-500'>Loading locations...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className='text-center py-12 bg-white rounded-2xl'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className='text-lg text-gray-500 mb-4'>No locations added yet</p>
              <button
                onClick={() => setShowForm(true)}
                className='px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors'
              >
                Add Your First Location
              </button>
            </div>
          ) : (
            <div className='bg-white rounded-2xl border-2 border-gray-200 overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-white border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left'>
                      <input
                        type='checkbox'
                        checked={selectedLocations.length === locations.length && locations.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                      />
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Location Name</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Order</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Status</th>
                    <th className='px-6 py-4 text-right text-sm font-semibold text-gray-300'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {locations.map((location) => (
                    <tr key={location.id} className='hover:bg-blue-50/30 transition-colors'>
                      <td className='px-6 py-4'>
                        <input
                          type='checkbox'
                          checked={selectedLocations.includes(location.id)}
                          onChange={(e) => handleSelectLocation(location.id, e.target.checked)}
                          className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer'
                        />
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className='font-medium text-[#000000]'>{location.name}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-gray-600'>{location.order}</td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          location.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => handleEdit(location)}
                            className='p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors'
                            title='Edit'
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(location.id)}
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
          )}
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Location'
        message='Are you sure you want to delete this location? This action cannot be undone.'
        confirmText='Delete'
        type='danger'
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={bulkDeleteDialog.isOpen}
        onClose={() => setBulkDeleteDialog({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDeleteConfirm}
        title='Bulk Delete Locations'
        message={`Are you sure you want to delete ${bulkDeleteDialog.count} location${bulkDeleteDialog.count > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText='Delete All'
        cancelText='Cancel'
        type='danger'
      />

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  )
}
