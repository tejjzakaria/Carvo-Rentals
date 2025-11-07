'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'
import Toast from '@/components/Toast'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export default function NewEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'manager',
    phone: '',
    avatar: ''
  })
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setToast({ show: true, message: 'Please upload a valid image file (JPG, PNG, GIF, WebP)', type: 'error' })
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setToast({ show: true, message: 'Image size must be less than 2MB', type: 'error' })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData(prev => ({ ...prev, avatar: data.url }))
        setToast({ show: true, message: 'Image uploaded successfully!', type: 'success' })
      } else {
        setToast({ show: true, message: data.error || 'Failed to upload image', type: 'error' })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setToast({ show: true, message: 'Failed to upload image', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setToast({ show: true, message: 'Please fill in all required fields', type: 'error' })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match', type: 'error' })
      return
    }

    if (formData.password.length < 6) {
      setToast({ show: true, message: 'Password must be at least 6 characters', type: 'error' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone || null,
          avatar: formData.avatar || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        setToast({ show: true, message: 'Employee created successfully!', type: 'success' })
        setTimeout(() => {
          router.push('/admin/employees')
        }, 1500)
      } else {
        setToast({ show: true, message: data.error || 'Failed to create employee', type: 'error' })
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      setToast({ show: true, message: 'An error occurred while creating the employee', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AdminHeader
        title="Add New Employee"
        subtitle="Create a new employee account"
      />

      <main className='p-8'>
          <div className='max-w-4xl mx-auto'>
            <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              {/* Profile Image */}
              <div className='mb-8 pb-8 border-b border-gray-200'>
                <h3 className='text-lg font-bold text-[#000000] mb-4'>Profile Photo</h3>
                <div className='flex items-center gap-6'>
                  {formData.avatar ? (
                    <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-primary'>
                      <img
                        src={formData.avatar}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ) : (
                    <div className='w-24 h-24 bg-linear-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-3xl font-bold'>
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'E'}
                    </div>
                  )}
                  <div>
                    <input
                      type='file'
                      id='avatar-upload'
                      accept='image/jpeg,image/png,image/gif,image/webp'
                      onChange={handleImageUpload}
                      className='hidden'
                    />
                    <label
                      htmlFor='avatar-upload'
                      className={`inline-block px-6 py-2 bg-primary text-white rounded-xl transition-all font-semibold mb-2 cursor-pointer ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </label>
                    <p className='text-xs text-gray-300'>JPG, PNG, GIF or WebP. Max size 2MB</p>
                    {formData.avatar && (
                      <button
                        type='button'
                        onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                        className='text-xs text-red-600 font-semibold mt-1 block'
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className='mb-8 pb-8 border-b border-gray-200'>
                <h3 className='text-lg font-bold text-[#000000] mb-4'>Basic Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                      Full Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      placeholder='John Doe'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                      Email <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      placeholder='john@example.com'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      placeholder='+212 600 000 000'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                      Role <span className='text-red-500'>*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      required
                    >
                      <option value='manager'>Manager</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className='mb-8'>
                <h3 className='text-lg font-bold text-[#000000] mb-4'>Security</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                      Password <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='password'
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      placeholder='Minimum 6 characters'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                      Confirm Password <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='password'
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      placeholder='Re-enter password'
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-4 justify-end'>
                <button
                  type='button'
                  onClick={() => router.push('/admin/employees')}
                  className='px-8 py-3 border-2 border-gray-200 text-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className={`px-8 py-3 bg-primary text-white rounded-xl font-semibold transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                  }`}
                >
                  {loading ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
      </main>

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
