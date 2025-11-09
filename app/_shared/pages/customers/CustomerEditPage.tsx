/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function EditCustomerPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string
  const { formatCurrency } = useSettings()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    status: 'active'
  })
  const [customerStats, setCustomerStats] = useState({
    totalRentals: 0,
    totalSpent: 0
  })

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setFetching(true)
      const response = await fetch(`/api/customers/${customerId}`)
      const data = await response.json()

      if (data.success && data.customer) {
        const customer = data.customer
        setFormData({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          location: customer.location,
          status: customer.status
        })
        setCustomerStats({
          totalRentals: customer.totalRentals || 0,
          totalSpent: customer.totalSpent || 0
        })
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
      setFetching(false)
    }
  }

  const statusOptions = ['active', 'inactive']
  const locationSuggestions = [
    'Casablanca, Morocco',
    'Rabat, Morocco',
    'Marrakech, Morocco',
    'Tangier, Morocco',
    'Fes, Morocco',
    'Agadir, Morocco',
    'Meknes, Morocco',
    'Oujda, Morocco'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToast({
          show: true,
          message: 'Customer updated successfully!',
          type: 'success'
        })

        setTimeout(() => {
          router.push(`${basePath}/customers`)
        }, 1500)
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to update customer',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      setToast({
        show: true,
        message: 'An error occurred while updating the customer',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <>
        <HeaderComponent title="Edit Customer" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading customer...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HeaderComponent title="Edit Customer" subtitle="Update customer information" />

        <main className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Personal Information */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='e.g., Ahmed Hassan'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Email Address *
                        </label>
                        <input
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='customer@example.com'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Phone Number *
                        </label>
                        <input
                          type='tel'
                          name='phone'
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='+212 6 00 00 00 00'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Status */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location & Status
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Location *
                      </label>
                      <input
                        type='text'
                        name='location'
                        value={formData.location}
                        onChange={handleChange}
                        required
                        list='location-suggestions'
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='e.g., Casablanca, Morocco'
                      />
                      <datalist id='location-suggestions'>
                        {locationSuggestions.map((loc) => (
                          <option key={loc} value={loc} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Status *
                      </label>
                      <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6'>Customer Summary</h2>

                  <div className='space-y-4 mb-6'>
                    <div className='flex items-center justify-center mb-6'>
                      <div className='w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Full Name</span>
                      <span className='font-semibold text-[#000000] text-right'>
                        {formData.name || '-'}
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Email</span>
                      <span className='font-semibold text-[#000000] text-right break-all'>
                        {formData.email || '-'}
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Phone</span>
                      <span className='font-semibold text-[#000000]'>
                        {formData.phone || '-'}
                      </span>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Location</span>
                        <span className='text-[#000000] text-right'>
                          {formData.location || '-'}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-300'>Status</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          formData.status === 'active'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='text-center'>
                        <p className='text-sm text-gray-500 mb-2'>Customer Statistics</p>
                        <div className='flex justify-center gap-8'>
                          <div>
                            <p className='text-2xl font-bold text-[#000000]'>{customerStats.totalRentals}</p>
                            <p className='text-xs text-gray-300'>Rentals</p>
                          </div>
                          <div>
                            <p className='text-2xl font-bold text-primary'>{formatCurrency(customerStats.totalSpent)}</p>
                            <p className='text-xs text-gray-300'>Spent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {loading ? 'Updating Customer...' : 'Update Customer'}
                    </button>

                    <button
                      type='button'
                      onClick={() => router.push(`${basePath}/customers`)}
                      disabled={loading}
                      className='w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
