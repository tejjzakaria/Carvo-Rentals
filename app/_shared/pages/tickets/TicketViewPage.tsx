/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Toast from '@/components/Toast'

interface Ticket {
  id: string
  ticketId: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  assignedTo: string | null
  reportedBy: string
  reportedByEmail: string | null
  attachments: string[]
  resolution: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  closedAt: string | null
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

export default function TicketViewPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    status: '',
    assignedTo: '',
    resolution: ''
  })
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tickets/${ticketId}`)
      const data = await response.json()

      if (data.success && data.ticket) {
        setTicket(data.ticket)
        setFormData({
          title: data.ticket.title,
          description: data.ticket.description,
          category: data.ticket.category,
          priority: data.ticket.priority,
          status: data.ticket.status,
          assignedTo: data.ticket.assignedTo || '',
          resolution: data.ticket.resolution || ''
        })
      } else {
        setToast({
          show: true,
          message: 'Ticket not found',
          type: 'error'
        })
        setTimeout(() => router.push(`${basePath}/tickets`), 2000)
      }
    } catch (error) {
      console.error('Error fetching ticket:', error)
      setToast({
        show: true,
        message: 'Failed to load ticket',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          show: true,
          message: 'Ticket updated successfully',
          type: 'success'
        })
        setEditing(false)
        fetchTicket()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || 'Failed to update ticket',
        type: 'error'
      })
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bug':
        return '🐛'
      case 'feature_request':
        return '✨'
      case 'improvement':
        return '📈'
      case 'question':
        return '❓'
      default:
        return '📋'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <>
        <HeaderComponent title="Ticket Details" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading ticket...</p>
          </div>
        </div>
      </>
    )
  }

  if (!ticket) {
    return null
  }

  return (
    <>
      <HeaderComponent
        title={ticket.ticketId}
        subtitle={ticket.title}
        {...(basePath === '/admin' && {
          actionButton: {
            label: editing ? 'Cancel' : 'Edit Ticket',
            onClick: () => setEditing(!editing),
            icon: editing ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )
          }
        })}
      />

      <main className='p-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Status Badges */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <div className='flex flex-wrap items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-3xl'>{getCategoryIcon(ticket.category)}</span>
                  <span className='text-sm font-medium text-gray-300'>
                    {ticket.category.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.toUpperCase()}
                </span>
                <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Ticket Details */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              {editing ? (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={8}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none'
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-gray-300 mb-2'>Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                      >
                        <option value="bug">Bug</option>
                        <option value="feature_request">Feature Request</option>
                        <option value="improvement">Improvement</option>
                        <option value="question">Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-300 mb-2'>Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-300 mb-2'>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>Assigned To</label>
                    <input
                      type="text"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      placeholder="Leave empty for unassigned"
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
                    />
                  </div>

                  {(formData.status === 'resolved' || formData.status === 'closed') && (
                    <div>
                      <label className='block text-sm font-semibold text-gray-300 mb-2'>Resolution</label>
                      <textarea
                        name="resolution"
                        value={formData.resolution}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe how this issue was resolved..."
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none'
                      />
                    </div>
                  )}

                  <div className='flex items-center justify-end gap-4 pt-4 border-t border-gray-200'>
                    <button
                      onClick={() => setEditing(false)}
                      className='px-6 py-3 border border-gray-300 text-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className='px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all'
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-300 mb-4'>{ticket.title}</h3>
                    <p className='text-gray-300 whitespace-pre-wrap'>{ticket.description}</p>
                  </div>

                  {ticket.resolution && (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                      <h4 className='font-bold text-green-900 mb-2 flex items-center gap-2'>
                        <span>✅</span>
                        Resolution
                      </h4>
                      <p className='text-green-800 text-sm'>{ticket.resolution}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Reporter Info */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-bold text-gray-300 mb-4'>Reported By</h3>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm text-gray-500'>Name</p>
                  <p className='font-semibold text-gray-300'>{ticket.reportedBy}</p>
                </div>
                {ticket.reportedByEmail && (
                  <div>
                    <p className='text-sm text-gray-500'>Email</p>
                    <p className='font-semibold text-gray-300'>{ticket.reportedByEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-bold text-gray-300 mb-4'>Assignment</h3>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Assigned To</p>
                <p className='font-semibold text-gray-300'>{ticket.assignedTo || 'Unassigned'}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-bold text-gray-300 mb-4'>Timeline</h3>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>Created</p>
                  <p className='text-sm font-semibold text-gray-300'>{formatDate(ticket.createdAt)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Last Updated</p>
                  <p className='text-sm font-semibold text-gray-300'>{formatDate(ticket.updatedAt)}</p>
                </div>
                {ticket.resolvedAt && (
                  <div>
                    <p className='text-sm text-gray-500'>Resolved</p>
                    <p className='text-sm font-semibold text-green-600'>{formatDate(ticket.resolvedAt)}</p>
                  </div>
                )}
                {ticket.closedAt && (
                  <div>
                    <p className='text-sm text-gray-500'>Closed</p>
                    <p className='text-sm font-semibold text-gray-300'>{formatDate(ticket.closedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <button
                onClick={() => router.push(`${basePath}/tickets`)}
                className='w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-white font-semibold rounded-lg transition-colors'
              >
                Back to Tickets
              </button>
            </div>
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
