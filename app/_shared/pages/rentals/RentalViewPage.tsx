'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface Rental {
  id: string
  rentalId: string
  customerId: string
  vehicleId: string
  startDate: string
  endDate: string
  status: string
  withDriver: boolean
  insurance: boolean
  totalAmount: number
  paymentStatus: string
  notes?: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
    location: string
  }
  vehicle: {
    id: string
    name: string
    category: string
    plateNumber: string
    price: number
  }
  createdAt: string
  updatedAt: string
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

export default function ViewRentalPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const params = useParams()
  const rentalId = params.id as string

  const [rental, setRental] = useState<Rental | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    fetchRental()
  }, [rentalId])

  const fetchRental = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/rentals/${rentalId}`)
      const data = await response.json()

      if (data.success && data.rental) {
        setRental(data.rental)
      } else {
        setToast({
          show: true,
          message: 'Rental not found',
          type: 'error'
        })
        setTimeout(() => router.push(`${basePath}/rentals`), 2000)
      }
    } catch (error) {
      console.error('Error fetching rental:', error)
      setToast({
        show: true,
        message: 'Failed to load rental',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <>
        <HeaderComponent title="Rental Details" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading rental...</p>
          </div>
        </div>
      </>
    )
  }

  if (!rental) {
    return null
  }

  const days = Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / (1000 * 60 * 60 * 24))
  const baseAmount = rental.vehicle.price * days
  const driverCost = rental.withDriver ? 50 * days : 0
  const insuranceCost = rental.insurance ? 20 * days : 0

  return (
    <>
      <HeaderComponent
          title="Rental Details"
          subtitle={`Rental ID: ${rental.rentalId}`}
          actionButton={{
            label: 'Edit Rental',
            onClick: () => router.push(`${basePath}/rentals/${rental.id}/edit`),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )
          }}
        />

        <main className='p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Main Content */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Status Cards */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <p className='text-sm text-gray-500 mb-2'>Rental Status</p>
                  <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(rental.status)}`}>
                    {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                  </span>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <p className='text-sm text-gray-500 mb-2'>Payment Status</p>
                  <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getPaymentStatusColor(rental.paymentStatus)}`}>
                    {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Name</p>
                    <p className='font-semibold text-[#000000]'>{rental.customer.name}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Email</p>
                    <p className='font-semibold text-[#000000]'>{rental.customer.email}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Phone</p>
                    <p className='font-semibold text-[#000000]'>{rental.customer.phone}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Location</p>
                    <p className='font-semibold text-[#000000]'>{rental.customer.location}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Vehicle Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Vehicle Name</p>
                    <p className='font-semibold text-[#000000]'>{rental.vehicle.name}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Category</p>
                    <p className='font-semibold text-[#000000]'>{rental.vehicle.category}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Plate Number</p>
                    <p className='font-semibold text-[#000000]'>{rental.vehicle.plateNumber}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Daily Rate</p>
                    <p className='font-semibold text-primary text-lg'>${rental.vehicle.price}</p>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Rental Period
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Start Date</p>
                    <p className='font-semibold text-[#000000]'>{formatDate(rental.startDate)}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>End Date</p>
                    <p className='font-semibold text-[#000000]'>{formatDate(rental.endDate)}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Duration</p>
                    <p className='font-semibold text-primary text-lg'>{days} day{days > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Additional Services
                </h2>

                <div className='flex gap-4'>
                  <div className={`flex-1 p-4 rounded-xl border-2 ${rental.withDriver ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className='flex items-center gap-2 mb-2'>
                      {rental.withDriver ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <p className={`font-semibold ${rental.withDriver ? 'text-green-800' : 'text-gray-500'}`}>With Driver</p>
                    </div>
                    {rental.withDriver && <p className='text-sm text-green-700'>+${50 * days} (${50}/day)</p>}
                  </div>

                  <div className={`flex-1 p-4 rounded-xl border-2 ${rental.insurance ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className='flex items-center gap-2 mb-2'>
                      {rental.insurance ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <p className={`font-semibold ${rental.insurance ? 'text-green-800' : 'text-gray-500'}`}>Insurance Coverage</p>
                    </div>
                    {rental.insurance && <p className='text-sm text-green-700'>+${20 * days} (${20}/day)</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                <h2 className='text-xl font-bold text-[#000000] mb-6'>Pricing Summary</h2>

                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-500'>Base Rate ({days} days)</span>
                    <span className='font-semibold text-[#000000]'>{formatCurrency(baseAmount)}</span>
                  </div>

                  {rental.withDriver && (
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-500'>Driver Service</span>
                      <span className='font-semibold text-[#000000]'>+{formatCurrency(driverCost)}</span>
                    </div>
                  )}

                  {rental.insurance && (
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-500'>Insurance</span>
                      <span className='font-semibold text-[#000000]'>+{formatCurrency(insuranceCost)}</span>
                    </div>
                  )}

                  <div className='border-t border-gray-200 pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-bold text-[#000000]'>Total Amount</span>
                      <span className='text-3xl font-bold text-primary'>{formatCurrency(rental.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className='border-t border-gray-200 pt-4 mb-6'>
                  <div className='text-xs text-gray-500 mb-2'>
                    <p>Created: {formatDate(rental.createdAt)}</p>
                    <p>Updated: {formatDate(rental.updatedAt)}</p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <button
                    onClick={() => router.push(`${basePath}/rentals/${rental.id}/edit`)}
                    className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                  >
                    Edit Rental
                  </button>

                  <button
                    onClick={() => {
                      localStorage.setItem('preselectedVehicleId', rental.vehicleId)
                      localStorage.setItem('preselectedRentalId', rental.id)
                      router.push(`${basePath}/damages/new`)
                    }}
                    className='w-full px-6 py-4 bg-white border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Report Damage
                  </button>

                  <button
                    onClick={() => router.push(`${basePath}/rentals`)}
                    className='w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-xl transition-all'
                  >
                    Back to Rentals
                  </button>
                </div>
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
