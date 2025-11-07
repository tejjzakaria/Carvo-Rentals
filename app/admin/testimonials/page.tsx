'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'
import Toast from '@/components/Toast'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  image?: string
  isActive: boolean
  createdAt: string
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: '',
    image: '',
    isActive: true
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
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      if (data.success) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId
        ? `/api/testimonials/${editingId}`
        : '/api/testimonials'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        fetchTestimonials()
        resetForm()
        setToast({
          message: editingId ? 'Testimonial updated successfully' : 'Testimonial created successfully',
          type: 'success'
        })
      } else {
        setToast({
          message: data.error || 'Failed to save testimonial',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      setToast({
        message: 'Failed to save testimonial',
        type: 'error'
      })
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      comment: testimonial.comment,
      image: testimonial.image || '',
      isActive: testimonial.isActive
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setConfirmDialog({
      show: true,
      title: 'Delete Testimonial',
      message: 'Are you sure you want to delete this testimonial? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/testimonials/${id}`, {
            method: 'DELETE'
          })

          const data = await res.json()
          if (data.success) {
            fetchTestimonials()
            setToast({
              message: 'Testimonial deleted successfully',
              type: 'success'
            })
          } else {
            setToast({
              message: data.error || 'Failed to delete testimonial',
              type: 'error'
            })
          }
        } catch (error) {
          console.error('Error deleting testimonial:', error)
          setToast({
            message: 'Failed to delete testimonial',
            type: 'error'
          })
        }
      }
    })
  }

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testimonial,
          isActive: !testimonial.isActive
        })
      })

      const data = await res.json()
      if (data.success) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      rating: 5,
      comment: '',
      image: '',
      isActive: true
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
        name === 'rating' ? parseInt(value) : value
    }))
  }

  return (
    <>
      <AdminHeader
        title="Testimonials"
        subtitle="Manage customer testimonials displayed on the website"
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
              + Add New Testimonial
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
              <div className='bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                <h2 className='text-2xl font-bold text-[#000000] mb-6'>
                  {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Name *
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-[#000000] mb-2'>
                        Location *
                      </label>
                      <input
                        type='text'
                        name='location'
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Rating *
                    </label>
                    <select
                      name='rating'
                      value={formData.rating}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Comment *
                    </label>
                    <textarea
                      name='comment'
                      value={formData.comment}
                      onChange={handleChange}
                      required
                      rows={4}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                      placeholder='Enter customer testimonial...'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-[#000000] mb-2'>
                      Image URL (Optional)
                    </label>
                    <input
                      type='text'
                      name='image'
                      value={formData.image}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none'
                      placeholder='https://example.com/image.jpg'
                    />
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
                      className='flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors'
                    >
                      {editingId ? 'Update' : 'Create'} Testimonial
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

          {/* Testimonials List */}
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-gray-300'>Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-300 mb-4'>No testimonials yet</p>
              <button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className='px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors'
              >
                Add Your First Testimonial
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative'
                >
                  {/* Active Badge */}
                  <div className='absolute top-4 right-4'>
                    <button
                      onClick={() => toggleActive(testimonial)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        testimonial.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-300'
                      }`}
                    >
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Rating */}
                  <div className='flex gap-1 mb-3'>
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-accent"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className='text-gray-300 mb-4 line-clamp-3'>
                    "{testimonial.comment}"
                  </p>

                  {/* Customer Info */}
                  <div className='mb-4'>
                    <h4 className='font-bold text-[#000000]'>{testimonial.name}</h4>
                    <p className='text-sm text-gray-300'>{testimonial.location}</p>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 pt-4 border-t border-gray-200'>
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className='flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
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
