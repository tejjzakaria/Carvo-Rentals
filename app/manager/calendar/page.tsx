'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import ManagerHeader from '@/components/ManagerHeader'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useSettings } from '@/contexts/SettingsContext'

const localizer = momentLocalizer(moment)

interface Rental {
  id: string
  rentalId: string
  customerId: string
  vehicleId: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  vehicle: {
    id: string
    name: string
    category: string
    plateNumber: string
  }
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Rental
}

export default function CalendarPage() {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Rental | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchRentals()
  }, [statusFilter])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/calendar?${params}`)
      const data = await response.json()

      if (data.success) {
        setRentals(data.rentals)
      }
    } catch (error) {
      console.error('Failed to fetch rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const events: CalendarEvent[] = useMemo(() => {
    return rentals.map((rental) => ({
      id: rental.id,
      title: `${rental.vehicle.name} - ${rental.customer.name}`,
      start: new Date(rental.startDate),
      end: new Date(rental.endDate),
      resource: rental
    }))
  }, [rentals])

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource.status
    let backgroundColor = '#3B82F6' // default blue

    switch (status) {
      case 'active':
        backgroundColor = '#10B981' // green
        break
      case 'pending':
        backgroundColor = '#F59E0B' // yellow
        break
      case 'completed':
        backgroundColor = '#6366F1' // indigo
        break
      case 'cancelled':
        backgroundColor = '#EF4444' // red
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '13px',
        padding: '4px 8px'
      }
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource)
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stats = [
    {
      title: 'Total Rentals',
      value: rentals.length,
      color: 'from-primary to-primary-dark',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Active',
      value: rentals.filter(r => r.status === 'active').length,
      color: 'from-green-500 to-green-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Pending',
      value: rentals.filter(r => r.status === 'pending').length,
      color: 'from-yellow-500 to-yellow-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Completed',
      value: rentals.filter(r => r.status === 'completed').length,
      color: 'from-blue-500 to-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ]

  return (
    <>
      <ManagerHeader
        title="Calendar"
        subtitle="View all rentals and reservations in calendar view"
        actionButton={{
          label: 'Add New Rental',
          onClick: () => router.push('/manager/rentals/new'),
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
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                {['all', 'active', 'pending', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      statusFilter === status
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className='flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-green-500'></div>
                  <span className='text-gray-600'>Active</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-yellow-500'></div>
                  <span className='text-gray-600'>Pending</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-blue-600'></div>
                  <span className='text-gray-600'>Completed</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded bg-red-500'></div>
                  <span className='text-gray-600'>Cancelled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
            {loading ? (
              <div className='flex items-center justify-center py-20'>
                <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
              </div>
            ) : (
              <div style={{ height: 700 }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  view={view}
                  onView={setView}
                  date={date}
                  onNavigate={setDate}
                  views={['month', 'week', 'day', 'agenda']}
                  popup
                />
              </div>
            )}
          </div>
      </main>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Modal Header */}
            <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl'>
              <div>
                <h2 className='text-2xl font-bold text-[#000000]'>Rental Details</h2>
                <p className='text-sm text-gray-500'>{selectedEvent.rentalId}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-6'>
              {/* Status */}
              <div className='mb-6'>
                <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </span>
              </div>

              {/* Vehicle Info */}
              <div className='mb-6 pb-6 border-b border-gray-200'>
                <h3 className='text-lg font-bold text-[#000000] mb-3'>Vehicle</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Vehicle Name</p>
                    <p className='font-semibold text-[#000000]'>{selectedEvent.vehicle.name}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Category</p>
                    <p className='font-semibold text-[#000000]'>{selectedEvent.vehicle.category}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Plate Number</p>
                    <p className='font-semibold text-[#000000]'>{selectedEvent.vehicle.plateNumber}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className='mb-6 pb-6 border-b border-gray-200'>
                <h3 className='text-lg font-bold text-[#000000] mb-3'>Customer</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Name</p>
                    <p className='font-semibold text-[#000000]'>{selectedEvent.customer.name}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Email</p>
                    <p className='font-semibold text-[#000000]'>{selectedEvent.customer.email}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Phone</p>
                    <p className='font-semibold text-[#000000]'>{selectedEvent.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className='mb-6 pb-6 border-b border-gray-200'>
                <h3 className='text-lg font-bold text-[#000000] mb-3'>Rental Period</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Start Date</p>
                    <p className='font-semibold text-[#000000]'>{formatDate(selectedEvent.startDate)}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>End Date</p>
                    <p className='font-semibold text-[#000000]'>{formatDate(selectedEvent.endDate)}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Duration</p>
                    <p className='font-semibold text-[#000000]'>
                      {Math.ceil((new Date(selectedEvent.endDate).getTime() - new Date(selectedEvent.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold text-[#000000] mb-3'>Pricing</h3>
                <div className='bg-gray-50 rounded-xl p-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>Total Amount</span>
                    <span className='text-2xl font-bold text-primary'>{formatCurrency(selectedEvent.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowModal(false)
                    router.push(`/manager/rentals/${selectedEvent.id}`)
                  }}
                  className='flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all'
                >
                  View Full Details
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    router.push(`/manager/rentals/${selectedEvent.id}/edit`)
                  }}
                  className='flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all'
                >
                  Edit Rental
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
