/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function TicketNewPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'bug',
    priority: 'medium',
    reportedBy: '',
    reportedByEmail: '',
    assignedTo: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.reportedBy) {
      setToast({
        show: true,
        message: 'Please fill in all required fields',
        type: 'error'
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          show: true,
          message: 'Ticket created successfully',
          type: 'success'
        })
        setTimeout(() => {
          router.push(`${basePath}/tickets`)
        }, 1500)
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || 'Failed to create ticket',
        type: 'error'
      })
      setSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <HeaderComponent
        title="New Support Ticket"
        subtitle="Report a bug or request assistance"
      />

      <main className='p-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Title */}
              <div>
                <label htmlFor="title" className='block text-sm font-semibold text-gray-300 mb-2'>
                  Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief summary of the issue"
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className='block text-sm font-semibold text-gray-300 mb-2'>
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the issue..."
                  rows={6}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none'
                  required
                />
              </div>

              {/* Category, Priority, Reported By Row */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label htmlFor="category" className='block text-sm font-semibold text-gray-300 mb-2'>
                    Category <span className='text-red-500'>*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                    required
                  >
                    <option value="bug">🐛 Bug</option>
                    <option value="feature_request">✨ Feature Request</option>
                    <option value="improvement">📈 Improvement</option>
                    <option value="question">❓ Question</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className='block text-sm font-semibold text-gray-300 mb-2'>
                    Priority <span className='text-red-500'>*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                    required
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reportedBy" className='block text-sm font-semibold text-gray-300 mb-2'>
                    Reported By <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    id="reportedBy"
                    name="reportedBy"
                    value={formData.reportedBy}
                    onChange={handleChange}
                    placeholder="Your name"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                    required
                  />
                </div>
              </div>

              {/* Email and Assigned To Row */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label htmlFor="reportedByEmail" className='block text-sm font-semibold text-gray-300 mb-2'>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="reportedByEmail"
                    name="reportedByEmail"
                    value={formData.reportedByEmail}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                  />
                </div>

                <div>
                  <label htmlFor="assignedTo" className='block text-sm font-semibold text-gray-300 mb-2'>
                    Assign To (Optional)
                  </label>
                  <input
                    type="text"
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    placeholder="Leave empty for unassigned"
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <h4 className='font-semibold text-blue-900 mb-2 flex items-center gap-2'>
                  <span>💡</span>
                  Tips for Better Support
                </h4>
                <ul className='text-sm text-blue-800 space-y-1 ml-6'>
                  <li>• Provide a clear, descriptive title</li>
                  <li>• Include steps to reproduce the issue</li>
                  <li>• Mention what you expected vs what actually happened</li>
                  <li>• Add browser/device information if relevant</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center justify-end gap-4 pt-4 border-t border-gray-200'>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className='px-6 py-3 border border-gray-300 text-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className='px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed'
                >
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
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
