/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Toast from '@/components/Toast'
import CustomerDocuments from '@/components/CustomerDocuments'
import { useSettings } from '@/contexts/SettingsContext'

interface Rental {
  id: string
  rentalId: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  paymentStatus: string
  vehicle: {
    name: string
    category: string
  }
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: string
  avatar: string
  totalRentals: number
  totalSpent: number
  createdAt: string
  updatedAt: string
  rentals: Rental[]
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

export default function ViewCustomerPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${customerId}`)
      const data = await response.json()

      if (data.success && data.customer) {
        setCustomer(data.customer)
      } else {
        setToast({
          show: true,
          message: 'Customer not found',
          type: 'error'
        })
        setTimeout(() => router.push(`${basePath}/customers`), 2000)
      }
    } catch (error) {
      console.error('Error fetching customer:', error)
      setToast({
        show: true,
        message: 'Failed to load customer',
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

  if (loading) {
    return (
      <>
        <HeaderComponent title="Customer Details" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading customer...</p>
          </div>
        </div>
      </>
    )
  }

  if (!customer) {
    return null
  }

  return (
    <>
      <HeaderComponent
          title="Customer Details"
          subtitle={customer.name}
          actionButton={{
            label: 'Edit Customer',
            onClick: () => router.push(`${basePath}/customers/${customer.id}/edit`),
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
              {/* Customer Information */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>

                <div className='flex items-center gap-6 mb-6'>
                  <div className='w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-[#000000]'>{customer.name}</h3>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border mt-2 ${
                      customer.status === 'active'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Email Address</p>
                    <p className='font-semibold text-[#000000]'>{customer.email}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Phone Number</p>
                    <p className='font-semibold text-[#000000]'>{customer.phone}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Location</p>
                    <p className='font-semibold text-[#000000]'>{customer.location}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Member Since</p>
                    <p className='font-semibold text-[#000000]'>{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <p className='text-sm text-gray-500 mb-1'>Total Rentals</p>
                  <p className='text-3xl font-bold text-[#000000]'>{customer.totalRentals}</p>
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white shadow-lg'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className='text-sm text-gray-500 mb-1'>Total Spent</p>
                  <p className='text-3xl font-bold text-primary'>{formatCurrency(customer.totalSpent)}</p>
                </div>
              </div>

              {/* Documents Section */}
              <CustomerDocuments customerId={customer.id} />

              {/* Rental History */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Rental History
                </h2>

                {customer.rentals && customer.rentals.length > 0 ? (
                  <div className='space-y-4'>
                    {customer.rentals.map((rental) => (
                      <div
                        key={rental.id}
                        className='p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'
                        onClick={() => router.push(`${basePath}/rentals/${rental.id}`)}
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <div>
                            <p className='font-semibold text-[#000000]'>{rental.vehicle.name}</p>
                            <p className='text-sm text-gray-500'>{rental.vehicle.category}</p>
                          </div>
                          <div className='text-right'>
                            <p className='font-bold text-primary'>{formatCurrency(rental.totalAmount)}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(rental.status)}`}>
                              {rental.status}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center gap-4 text-xs text-gray-500'>
                          <span>{formatDate(rental.startDate)}</span>
                          <span>→</span>
                          <span>{formatDate(rental.endDate)}</span>
                          <span>•</span>
                          <span>ID: {rental.rentalId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className='text-gray-500'>No rental history</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                <h2 className='text-xl font-bold text-[#000000] mb-6'>Quick Actions</h2>

                <div className='space-y-3 mb-6'>
                  <button
                    onClick={() => router.push(`${basePath}/customers/${customer.id}/edit`)}
                    className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                  >
                    Edit Customer
                  </button>

                  <button
                    onClick={() => router.push(`${basePath}/rentals/new`)}
                    className='w-full px-6 py-4 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all'
                  >
                    Create New Rental
                  </button>

                  <button
                    onClick={() => router.push(`${basePath}/customers`)}
                    className='w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-xl transition-all'
                  >
                    Back to Customers
                  </button>
                </div>

                <div className='border-t border-gray-200 pt-4'>
                  <div className='text-xs text-gray-500'>
                    <p className='mb-1'><span className='font-semibold'>Created:</span> {formatDate(customer.createdAt)}</p>
                    <p><span className='font-semibold'>Updated:</span> {formatDate(customer.updatedAt)}</p>
                  </div>
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
