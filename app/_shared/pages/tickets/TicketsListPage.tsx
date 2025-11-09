'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

interface Stats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
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

export default function TicketsListPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  })
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    fetchTickets()
  }, [filterStatus, filterPriority, filterCategory])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterPriority !== 'all') params.append('priority', filterPriority)
      if (filterCategory !== 'all') params.append('category', filterCategory)

      const response = await fetch(`/api/tickets?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setTickets(data.tickets)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setToast({
        show: true,
        message: 'Failed to load tickets',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return

    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setToast({
          show: true,
          message: 'Ticket deleted successfully',
          type: 'success'
        })
        fetchTickets()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      setToast({
        show: true,
        message: error.message || 'Failed to delete ticket',
        type: 'error'
      })
    }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <>
        <HeaderComponent title="Support Tickets" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading tickets...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HeaderComponent
        title="Support Tickets"
        subtitle={`${stats.total} total tickets`}
        actionButton={{
          label: 'New Ticket',
          onClick: () => router.push(`${basePath}/tickets/new`),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )
        }}
      />

      <main className='p-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Total Tickets</p>
                <p className='text-3xl font-bold text-gray-300'>{stats.total}</p>
              </div>
              <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center'>
                <span className='text-2xl'>📋</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Open</p>
                <p className='text-3xl font-bold text-blue-600'>{stats.open}</p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                <span className='text-2xl'>🔓</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>In Progress</p>
                <p className='text-3xl font-bold text-purple-600'>{stats.inProgress}</p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                <span className='text-2xl'>⚙️</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Resolved</p>
                <p className='text-3xl font-bold text-green-600'>{stats.resolved}</p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                <span className='text-2xl'>✅</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Closed</p>
                <p className='text-3xl font-bold text-gray-300'>{stats.closed}</p>
              </div>
              <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center'>
                <span className='text-2xl'>🔒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6'>
          <h3 className='font-bold text-gray-300 mb-4'>Filters</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary'
              >
                <option value="all">All Categories</option>
                <option value="bug">Bug</option>
                <option value="feature_request">Feature Request</option>
                <option value="improvement">Improvement</option>
                <option value="question">Question</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
          {tickets.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🎫</div>
              <h3 className='text-xl font-bold text-gray-300 mb-2'>No Tickets Found</h3>
              <p className='text-gray-300 mb-6'>Create your first support ticket to get started</p>
              <button
                onClick={() => router.push(`${basePath}/tickets/new`)}
                className='px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all'
              >
                Create Ticket
              </button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Ticket</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Category</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Priority</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Assigned To</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Reported By</th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>Created</th>
                    <th className='px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className='px-6 py-4'>
                        <div className='flex flex-col'>
                          <span className='font-semibold text-gray-300'>{ticket.ticketId}</span>
                          <span className='text-sm text-gray-300 mt-1'>{ticket.title}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-2xl'>{getCategoryIcon(ticket.category)}</span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-sm text-gray-300'>{ticket.assignedTo || '-'}</span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-sm text-gray-300'>{ticket.reportedBy}</span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-sm text-gray-300'>{formatDate(ticket.createdAt)}</span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <button
                          onClick={() => router.push(`${basePath}/tickets/${ticket.id}`)}
                          className='text-primary hover:text-primary-dark mr-3 transition-colors p-1'
                          title="View ticket"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {basePath === '/admin' && (
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className='text-red-600 hover:text-red-800 transition-colors p-1'
                            title="Delete ticket"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
