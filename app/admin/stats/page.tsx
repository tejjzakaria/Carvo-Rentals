/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Select, { components } from 'react-select'
import AdminHeader from '@/components/AdminHeader'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import { iconsList, getIconPath } from '@/lib/icons'

interface Stat {
  id: string
  number: string
  label: string
  icon: string
  iconUrl?: string
  color: string
  order: number
  isActive: boolean
  createdAt: string
}

// Prepare icon options for react-select with Custom option at the end
const iconOptions = [
  ...iconsList.map(icon => ({
    value: icon.value,
    label: icon.label,
    path: icon.path
  })),
  { value: 'custom', label: 'Custom Icon (Upload)', path: '' }
]

const colorOptions = [
  {
    value: 'from-primary to-primary-light',
    label: 'Primary',
    preview: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)'
  },
  {
    value: 'from-secondary to-secondary-light',
    label: 'Secondary',
    preview: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
  },
  {
    value: 'from-accent to-accent-light',
    label: 'Accent',
    preview: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
  },
  {
    value: 'from-primary to-secondary',
    label: 'Primary to Secondary',
    preview: 'linear-gradient(135deg, #1E40AF 0%, #DC2626 100%)'
  },
  {
    value: 'custom',
    label: 'Custom Colors',
    preview: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
  }
]

export default function StatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    number: '',
    label: '',
    icon: 'car',
    iconUrl: '',
    color: 'from-primary to-primary-light',
    order: 0,
    isActive: true
  })
  const [customIconFile, setCustomIconFile] = useState<File | null>(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [customColors, setCustomColors] = useState({
    startColor: '#1E40AF',
    endColor: '#3B82F6'
  })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate custom icon
    if (formData.icon === 'custom' && !customIconFile && !formData.iconUrl) {
      setToast({
        message: 'Please upload a custom icon',
        type: 'error'
      })
      return
    }

    try {
      setUploadingIcon(true)
      let iconUrl = formData.iconUrl

      // Convert custom icon to base64 if a new file is selected
      if (customIconFile) {
        const reader = new FileReader()
        iconUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(customIconFile)
        })
      }

      const url = editingId
        ? `/api/stats/${editingId}`
        : '/api/stats'
      const method = editingId ? 'PUT' : 'POST'

      // Handle custom color gradient
      let finalColor = formData.color
      if (formData.color === 'custom') {
        finalColor = `linear-gradient(135deg, ${customColors.startColor} 0%, ${customColors.endColor} 100%)`
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          color: finalColor,
          iconUrl: formData.icon === 'custom' ? iconUrl : null
        })
      })

      const data = await res.json()
      if (data.success) {
        fetchStats()
        resetForm()
        setToast({
          message: editingId ? 'Stat updated successfully' : 'Stat created successfully',
          type: 'success'
        })
      } else {
        setToast({
          message: data.error || 'Failed to save stat',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error saving stat:', error)
      setToast({
        message: 'Failed to save stat',
        type: 'error'
      })
    } finally {
      setUploadingIcon(false)
    }
  }

  const handleEdit = (stat: Stat) => {
    setEditingId(stat.id)
    setFormData({
      number: stat.number,
      label: stat.label,
      icon: stat.icon,
      iconUrl: stat.iconUrl || '',
      color: stat.color,
      order: stat.order,
      isActive: stat.isActive
    })
    setCustomIconFile(null)

    // If color is custom (starts with linear-gradient), extract colors
    if (stat.color.startsWith('linear-gradient')) {
      const colorMatch = stat.color.match(/#[0-9A-Fa-f]{6}/g)
      if (colorMatch && colorMatch.length >= 2) {
        setCustomColors({
          startColor: colorMatch[0],
          endColor: colorMatch[1]
        })
      }
    }

    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setConfirmDialog({
      show: true,
      title: 'Delete Stat',
      message: 'Are you sure you want to delete this stat? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/stats/${id}`, {
            method: 'DELETE'
          })

          const data = await res.json()
          if (data.success) {
            fetchStats()
            setToast({
              message: 'Stat deleted successfully',
              type: 'success'
            })
          } else {
            setToast({
              message: data.error || 'Failed to delete stat',
              type: 'error'
            })
          }
        } catch (error) {
          console.error('Error deleting stat:', error)
          setToast({
            message: 'Failed to delete stat',
            type: 'error'
          })
        }
      }
    })
  }

  const toggleActive = async (stat: Stat) => {
    try {
      const res = await fetch(`/api/stats/${stat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...stat,
          isActive: !stat.isActive
        })
      })

      const data = await res.json()
      if (data.success) {
        fetchStats()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      number: '',
      label: '',
      icon: 'car',
      iconUrl: '',
      color: 'from-primary to-primary-light',
      order: 0,
      isActive: true
    })
    setCustomIconFile(null)
    setCustomColors({
      startColor: '#1E40AF',
      endColor: '#3B82F6'
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        name === 'order' ? parseInt(value) || 0 : value
    }))
  }

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setToast({
          message: 'Please upload a valid image file',
          type: 'error'
        })
        return
      }
      setCustomIconFile(file)
    }
  }

  // Custom Option component for react-select to show icon preview
  const IconOption = (props: any) => {
    const { data } = props
    return (
      <components.Option {...props}>
        <div className='flex items-center gap-3'>
          {data.path && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.path} />
            </svg>
          )}
          <span>{data.label}</span>
        </div>
      </components.Option>
    )
  }

  // Custom SingleValue component to show selected icon
  const IconSingleValue = (props: any) => {
    const { data } = props
    return (
      <components.SingleValue {...props}>
        <div className='flex items-center gap-3'>
          {data.path && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.path} />
            </svg>
          )}
          <span>{data.label}</span>
        </div>
      </components.SingleValue>
    )
  }

  // Custom Option component for colors to show gradient preview
  const ColorOption = (props: any) => {
    const { data } = props
    return (
      <components.Option {...props}>
        <div className='flex items-center gap-3'>
          <div
            className='w-8 h-8 rounded-lg shadow-sm border border-gray-200'
            style={{ background: data.preview }}
          />
          <span>{data.label}</span>
        </div>
      </components.Option>
    )
  }

  // Custom SingleValue component for colors to show selected gradient
  const ColorSingleValue = (props: any) => {
    const { data } = props
    return (
      <components.SingleValue {...props}>
        <div className='flex items-center gap-3'>
          <div
            className='w-8 h-8 rounded-lg shadow-sm border border-gray-200'
            style={{ background: data.preview }}
          />
          <span>{data.label}</span>
        </div>
      </components.SingleValue>
    )
  }

  const getIconSvg = (iconName: string, iconUrl?: string | null) => {
    if (iconUrl && iconName === 'custom') {
      // Return a placeholder or custom rendering for uploaded icons
      return ''
    }
    return getIconPath(iconName)
  }

  return (
    <>
      <AdminHeader
        title="Stats Management"
        subtitle="Manage the Facts In Numbers section displayed on the website"
      />

      <main className='p-8'>
          {/* Add New Button */}
          <div className='mb-6 flex justify-end'>
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className='px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors'
            >
              + Add New Stat
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                <h2 className='text-2xl font-bold text-[#000000] mb-6'>
                  {editingId ? 'Edit Stat' : 'Add New Stat'}
                </h2>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Number *
                      </label>
                      <input
                        type='text'
                        name='number'
                        value={formData.number}
                        onChange={handleChange}
                        required
                        placeholder='e.g., 500+, 25K+, 99.9%'
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Label *
                      </label>
                      <input
                        type='text'
                        name='label'
                        value={formData.label}
                        onChange={handleChange}
                        required
                        placeholder='e.g., Premium Vehicles'
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Icon *
                      </label>
                      <Select
                        options={iconOptions}
                        value={iconOptions.find(opt => opt.value === formData.icon)}
                        onChange={(selected) => {
                          if (selected) {
                            setFormData({ ...formData, icon: selected.value })
                          }
                        }}
                        components={{ Option: IconOption, SingleValue: IconSingleValue }}
                        placeholder="Search and select an icon..."
                        isSearchable
                        className='react-select-container'
                        classNamePrefix='react-select'
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '0.75rem',
                            borderWidth: '2px',
                            borderColor: '#E5E7EB',
                            padding: '0.25rem',
                            '&:hover': {
                              borderColor: '#E5E7EB'
                            },
                            '&:focus-within': {
                              borderColor: 'var(--primary)',
                              boxShadow: 'none'
                            }
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? '#F3F4F6' : 'white',
                            color: '#000000',
                            cursor: 'pointer',
                            '&:active': {
                              backgroundColor: '#E5E7EB'
                            }
                          })
                        }}
                      />
                      {formData.icon === 'custom' && (
                        <div className='mt-4'>
                          <label className='block text-sm font-medium text-[#000000] mb-2'>
                            Upload Custom Icon *
                          </label>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={handleIconFileChange}
                            className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                          />
                          {customIconFile && (
                            <p className='text-sm text-green-600 mt-2'>
                              Selected: {customIconFile.name}
                            </p>
                          )}
                          {formData.iconUrl && !customIconFile && (
                            <p className='text-sm text-gray-300 mt-2'>
                              Current custom icon is uploaded
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Color Gradient *
                      </label>
                      <Select
                        options={colorOptions}
                        value={colorOptions.find(opt => opt.value === formData.color)}
                        onChange={(selected) => {
                          if (selected) {
                            setFormData({ ...formData, color: selected.value })
                          }
                        }}
                        components={{ Option: ColorOption, SingleValue: ColorSingleValue }}
                        placeholder="Select a color gradient..."
                        isSearchable
                        className='react-select-container'
                        classNamePrefix='react-select'
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '0.75rem',
                            borderWidth: '2px',
                            borderColor: '#E5E7EB',
                            padding: '0.25rem',
                            '&:hover': {
                              borderColor: '#E5E7EB'
                            },
                            '&:focus-within': {
                              borderColor: 'var(--primary)',
                              boxShadow: 'none'
                            }
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? '#F3F4F6' : 'white',
                            color: '#000000',
                            cursor: 'pointer',
                            '&:active': {
                              backgroundColor: '#E5E7EB'
                            }
                          })
                        }}
                      />
                      {formData.color === 'custom' && (
                        <div className='mt-4 space-y-4'>
                          <div>
                            <label className='block text-sm font-medium text-[#000000] mb-2'>
                              Start Color *
                            </label>
                            <div className='flex items-center gap-3'>
                              <input
                                type='color'
                                value={customColors.startColor}
                                onChange={(e) => setCustomColors({ ...customColors, startColor: e.target.value })}
                                className='h-12 w-20 border-2 border-gray-200 rounded-xl cursor-pointer'
                              />
                              <input
                                type='text'
                                value={customColors.startColor}
                                onChange={(e) => setCustomColors({ ...customColors, startColor: e.target.value })}
                                placeholder='#1E40AF'
                                className='flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono'
                              />
                            </div>
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-[#000000] mb-2'>
                              End Color *
                            </label>
                            <div className='flex items-center gap-3'>
                              <input
                                type='color'
                                value={customColors.endColor}
                                onChange={(e) => setCustomColors({ ...customColors, endColor: e.target.value })}
                                className='h-12 w-20 border-2 border-gray-200 rounded-xl cursor-pointer'
                              />
                              <input
                                type='text'
                                value={customColors.endColor}
                                onChange={(e) => setCustomColors({ ...customColors, endColor: e.target.value })}
                                placeholder='#3B82F6'
                                className='flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-mono'
                              />
                            </div>
                          </div>
                          <div className='p-4 rounded-xl border-2 border-gray-200'>
                            <p className='text-sm font-medium text-[#000000] mb-2'>Preview:</p>
                            <div
                              className='h-16 rounded-lg shadow-sm'
                              style={{ background: `linear-gradient(135deg, ${customColors.startColor} 0%, ${customColors.endColor} 100%)` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Display Order
                    </label>
                    <input
                      type='number'
                      name='order'
                      value={formData.order}
                      onChange={handleChange}
                      min={0}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                    />
                    <p className='text-sm text-gray-300 mt-1'>Lower numbers appear first</p>
                  </div>

                  <div className='flex items-center gap-3'>
                    <input
                      type='checkbox'
                      id='isActive'
                      name='isActive'
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
                      type='submit'
                      disabled={uploadingIcon}
                      className='flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {uploadingIcon ? 'Uploading...' : editingId ? 'Update' : 'Create'} Stat
                    </button>
                    <button
                      type='button'
                      onClick={resetForm}
                      className='flex-1 px-6 py-3 bg-gray-200 text-white rounded-xl font-semibold hover:bg-gray-300 transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stats List */}
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-gray-300'>Loading stats...</p>
            </div>
          ) : stats.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-300 mb-4'>No stats yet</p>
              <button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className='px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors'
              >
                Add Your First Stat
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative'
                >
                  {/* Active Badge */}
                  <div className='absolute top-4 right-4'>
                    <button
                      onClick={() => toggleActive(stat)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        stat.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-300'
                      }`}
                    >
                      {stat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 text-white rounded-xl mb-4 ${
                      stat.color.startsWith('linear-gradient') ? '' : `bg-linear-to-br ${stat.color}`
                    }`}
                    style={stat.color.startsWith('linear-gradient') ? { background: stat.color } : {}}
                  >
                    {stat.icon === 'custom' && stat.iconUrl ? (
                      <img src={stat.iconUrl} alt="Custom icon" className="w-8 h-8 object-contain" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconSvg(stat.icon, stat.iconUrl)} />
                      </svg>
                    )}
                  </div>

                  {/* Number */}
                  <h3 className='text-4xl font-bold text-[#000000] mb-2'>
                    {stat.number}
                  </h3>

                  {/* Label */}
                  <p className='text-gray-300 mb-2'>
                    {stat.label}
                  </p>

                  {/* Order */}
                  <p className='text-xs text-gray-300 mb-4'>
                    Order: {stat.order}
                  </p>

                  {/* Actions */}
                  <div className='flex gap-2 pt-4 border-t border-gray-200'>
                    <button
                      onClick={() => handleEdit(stat)}
                      className='flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id)}
                      className='flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} })}
        type="danger"
      />
    </>
  )
}
