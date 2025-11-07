'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NewCustomerPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [loading, setLoading] = useState(false)
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
  const [requestDocument, setRequestDocument] = useState(false)
  const [documentExpiry, setDocumentExpiry] = useState('')
  const [uploadLink, setUploadLink] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)

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

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const customerId = data.customer.id

        // If document is requested, create document upload request
        if (requestDocument) {
          try {
            const docResponse = await fetch(`/api/customers/${customerId}/documents`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                documentType: 'drivers_license',
                expiryDate: documentExpiry || null
              })
            })

            const docData = await docResponse.json()

            if (docResponse.ok && docData.success) {
              setUploadLink(docData.uploadLink)
              setShowLinkModal(true)
              setToast({
                show: true,
                message: 'Customer added and upload link generated!',
                type: 'success'
              })
            } else {
              console.error('Document request error:', docData.error, 'Status:', docResponse.status)
              const errorMsg = docData.error || 'Failed to create document request'
              setToast({
                show: true,
                message: `Customer added but ${errorMsg}`,
                type: 'warning'
              })
              setTimeout(() => {
                router.push(`${basePath}/customers/${customerId}`)
              }, 2000)
            }
          } catch (docError) {
            console.error('Error creating document request:', docError)
            setToast({
              show: true,
              message: 'Customer added but network error occurred while creating document request',
              type: 'warning'
            })
            setTimeout(() => {
              router.push(`${basePath}/customers/${customerId}`)
            }, 2000)
          }
        } else {
          setToast({
            show: true,
            message: 'Customer added successfully!',
            type: 'success'
          })
          setTimeout(() => {
            router.push(`${basePath}/customers`)
          }, 1500)
        }
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to add customer',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error adding customer:', error)
      setToast({
        show: true,
        message: 'An error occurred while adding the customer',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setToast({
      show: true,
      message: 'Link copied to clipboard!',
      type: 'success'
    })
  }

  return (
    <>
      <HeaderComponent title="Add New Customer" subtitle="Register a new customer" />

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

                {/* Document Request (Optional) */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Document Request (Optional)
                  </h2>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl'>
                      <input
                        type='checkbox'
                        id='requestDocument'
                        checked={requestDocument}
                        onChange={(e) => setRequestDocument(e.target.checked)}
                        className='w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded'
                      />
                      <label htmlFor='requestDocument' className='text-sm font-semibold text-[#000000] cursor-pointer'>
                        Request Driver's License upload from customer
                      </label>
                    </div>

                    {requestDocument && (
                      <div className='pl-4 space-y-4'>
                        <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
                          <p className='text-sm text-yellow-800'>
                            A secure upload link will be generated after creating the customer. You can share this link with the customer to upload their driver's license.
                          </p>
                        </div>

                        <div>
                          <label className='block text-sm font-semibold text-[#000000] mb-2'>
                            License Expiry Date (Optional)
                          </label>
                          <input
                            type='date'
                            value={documentExpiry}
                            onChange={(e) => setDocumentExpiry(e.target.value)}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                          />
                        </div>
                      </div>
                    )}
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
                        <p className='text-sm text-gray-500 mb-1'>New Customer</p>
                        <div className='flex justify-center gap-8'>
                          <div>
                            <p className='text-2xl font-bold text-[#000000]'>0</p>
                            <p className='text-xs text-gray-300'>Rentals</p>
                          </div>
                          <div>
                            <p className='text-2xl font-bold text-primary'>{formatCurrency(0)}</p>
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
                      {loading ? 'Adding Customer...' : 'Add Customer'}
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
      {/* Upload Link Modal */}
      {showLinkModal && uploadLink && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6'>
            <h3 className='text-xl font-bold text-[#000000] mb-4'>Upload Link Generated</h3>

            <div className='bg-gray-50 rounded-xl p-4 mb-4'>
              <p className='text-sm text-gray-600 mb-2'>Share this link with the customer:</p>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={uploadLink}
                  readOnly
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm'
                />
                <button
                  onClick={() => copyToClipboard(uploadLink)}
                  className='px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark'
                >
                  Copy
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-2'>Link expires in 7 days</p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => router.push(`${basePath}/customers`)}
                className='flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark'
              >
                Go to Customers
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className='px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
