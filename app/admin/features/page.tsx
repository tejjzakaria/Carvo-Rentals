'use client'
import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import Select from 'react-select'
import { iconsList, getIconPath } from '@/lib/icons'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface Feature {
  id: string
  icon: string
  iconUrl?: string
  title: string
  description: string
  order: number
  isActive: boolean
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [customIconFile, setCustomIconFile] = useState<File | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; featureId: string | null }>({
    show: false,
    featureId: null
  })
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    icon: '',
    iconUrl: '',
    title: '',
    description: '',
    order: 0,
    isActive: true
  })

  // Icon options for react-select
  const iconOptions = [
    ...iconsList.map(icon => ({
      value: icon.value,
      label: icon.label,
      path: icon.path
    })),
    { value: 'custom', label: 'Custom Icon (Upload)', path: '' }
  ]

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/features')
      const data = await res.json()
      if (data.success) {
        setFeatures(data.features)
      }
    } catch (error) {
      console.error('Error fetching features:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleIconChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      icon: selectedOption.value
    })
    if (selectedOption.value !== 'custom') {
      setCustomIconFile(null)
    }
  }

  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomIconFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let iconUrl = formData.iconUrl

      // Convert custom icon to base64 if a new file is selected
      if (customIconFile && formData.icon === 'custom') {
        const reader = new FileReader()
        iconUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(customIconFile)
        })
      }

      const url = editingFeature
        ? `/api/features/${editingFeature.id}`
        : '/api/features'
      const method = editingFeature ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          iconUrl: formData.icon === 'custom' ? iconUrl : null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToast({
          show: true,
          message: editingFeature
            ? 'Feature updated successfully!'
            : 'Feature added successfully!',
          type: 'success'
        })
        setShowModal(false)
        resetForm()
        fetchFeatures()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to save feature',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error saving feature:', error)
      setToast({
        show: true,
        message: 'An error occurred while saving the feature',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature)
    setFormData({
      icon: feature.icon,
      iconUrl: feature.iconUrl || '',
      title: feature.title,
      description: feature.description,
      order: feature.order,
      isActive: feature.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.featureId) return

    try {
      const response = await fetch(`/api/features/${deleteConfirm.featureId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToast({
          show: true,
          message: 'Feature deleted successfully!',
          type: 'success'
        })
        fetchFeatures()
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to delete feature',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting feature:', error)
      setToast({
        show: true,
        message: 'An error occurred while deleting the feature',
        type: 'error'
      })
    } finally {
      setDeleteConfirm({ show: false, featureId: null })
    }
  }

  const resetForm = () => {
    setFormData({
      icon: '',
      iconUrl: '',
      title: '',
      description: '',
      order: 0,
      isActive: true
    })
    setEditingFeature(null)
    setCustomIconFile(null)
  }

  // Custom components for react-select
  const IconOption = (props: any) => {
    const { data, innerRef, innerProps } = props
    return (
      <div ref={innerRef} {...innerProps} className='flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer'>
        {data.value === 'custom' ? (
          <>
            <div className='w-8 h-8 flex items-center justify-center bg-gray-200 rounded'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className='text-sm font-medium text-gray-300'>{data.label}</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.path} />
            </svg>
            <span className='text-sm text-gray-300'>{data.label}</span>
          </>
        )}
      </div>
    )
  }

  const IconSingleValue = (props: any) => {
    const { data } = props
    return (
      <div className='flex items-center gap-2'>
        {data.value === 'custom' ? (
          <>
            <div className='w-6 h-6 flex items-center justify-center bg-gray-200 rounded'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className='text-sm font-medium'>{data.label}</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.path} />
            </svg>
            <span className='text-sm'>{data.label}</span>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <AdminHeader
        title="Features"
        subtitle="Manage the features shown in the 'Why Choose Carvo?' section"
      />

      <main className='p-8'>
          {/* Header with Add Button */}
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-[#000000]'>All Features</h2>
              <p className='text-sm text-gray-500 mt-1'>Manage the features shown in the "Why Choose Carvo?" section</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
              className='px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg'
            >
              <span className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Feature
              </span>
            </button>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature) => (
              <div
                key={feature.id}
                className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow'
              >
                {/* Status Badge */}
                <div className='flex justify-end items-start mb-4'>
                  {feature.isActive ? (
                    <span className='px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full'>
                      Active
                    </span>
                  ) : (
                    <span className='px-2 py-1 bg-gray-100 text-gray-300 text-xs font-semibold rounded-full'>
                      Inactive
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-light text-white rounded-xl mb-4 shadow-lg'>
                  {feature.icon === 'custom' && feature.iconUrl ? (
                    <img src={feature.iconUrl} alt="Custom icon" className="w-8 h-8 object-contain" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(feature.icon)} />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <h3 className='text-lg font-bold text-[#000000] mb-2'>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className='text-sm text-gray-500 mb-4 line-clamp-3'>
                  {feature.description}
                </p>

                {/* Order Badge */}
                <div className='mb-4'>
                  <span className='text-xs text-gray-400'>Order: {feature.order}</span>
                </div>

                {/* Actions */}
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEdit(feature)}
                    className='flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, featureId: feature.id })}
                    className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {features.length === 0 && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <p className='text-lg text-gray-500 mb-4'>No features yet</p>
              <button
                onClick={() => {
                  resetForm()
                  setShowModal(true)
                }}
                className='px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors'
              >
                Add Your First Feature
              </button>
            </div>
          )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex justify-between items-center'>
                <h3 className='text-2xl font-bold text-[#000000]'>
                  {editingFeature ? 'Edit Feature' : 'Add New Feature'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-[#000000] mb-2'>
                  Display Order *
                </label>
                <input
                  type='number'
                  name='order'
                  value={formData.order}
                  onChange={handleChange}
                  required
                  min='0'
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#000000] mb-2'>
                  Icon *
                </label>
                <Select
                  options={iconOptions}
                  value={iconOptions.find(opt => opt.value === formData.icon)}
                  onChange={handleIconChange}
                  components={{ Option: IconOption, SingleValue: IconSingleValue }}
                  placeholder='Search and select an icon...'
                  className='react-select-container'
                  classNamePrefix='react-select'
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#E5E7EB',
                      borderWidth: '2px',
                      borderRadius: '0.75rem',
                      padding: '0.25rem',
                      '&:hover': {
                        borderColor: '#1E40AF'
                      }
                    })
                  }}
                />
              </div>

              {formData.icon === 'custom' && (
                <div>
                  <label className='block text-sm font-medium text-[#000000] mb-2'>
                    Upload Custom Icon *
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleCustomIconUpload}
                    className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                  {customIconFile && (
                    <p className='text-sm text-green-600 mt-2'>Selected: {customIconFile.name}</p>
                  )}
                  {editingFeature?.iconUrl && !customIconFile && (
                    <div className='mt-2'>
                      <img src={editingFeature.iconUrl} alt="Current icon" className="w-12 h-12 object-contain" />
                      <p className='text-xs text-gray-500 mt-1'>Current icon</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-[#000000] mb-2'>
                  Title *
                </label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder='e.g., 24/7 Availability'
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#000000] mb-2'>
                  Description *
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder='Describe this feature...'
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none text-[#000000]'
                />
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  name='isActive'
                  checked={formData.isActive}
                  onChange={handleChange}
                  className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                />
                <label className='text-sm font-medium text-[#000000]'>
                  Active (Show on website)
                </label>
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Saving...' : editingFeature ? 'Update Feature' : 'Add Feature'}
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className='px-6 py-3 bg-gray-200 hover:bg-gray-300 text-white font-semibold rounded-xl transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, featureId: null })}
        onConfirm={handleDelete}
        title="Delete Feature"
        message="Are you sure you want to delete this feature? This action cannot be undone."
        confirmText="Delete"
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
