/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface Vehicle {
  id: string
  name: string
  plateNumber: string
  category: string
}

interface Rental {
  id: string
  rentalId: string
  vehicle: {
    id: string
    name: string
  }
  customer: {
    name: string
  }
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

export default function NewDamagePage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency, settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    vehicleId: '',
    rentalId: '',
    severity: 'minor',
    description: '',
    repairCost: '',
    insuranceClaim: false,
    claimAmount: '',
    status: 'reported',
    images: [] as string[],
    reportedDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchVehicles()
    fetchRentals()

    // Check for preselected vehicle/rental from localStorage
    const preselectedVehicleId = localStorage.getItem('preselectedVehicleId')
    const preselectedRentalId = localStorage.getItem('preselectedRentalId')

    if (preselectedVehicleId) {
      setFormData(prev => ({ ...prev, vehicleId: preselectedVehicleId }))
      localStorage.removeItem('preselectedVehicleId')
    }

    if (preselectedRentalId) {
      setFormData(prev => ({ ...prev, rentalId: preselectedRentalId }))
      localStorage.removeItem('preselectedRentalId')
    }
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      if (data.success) {
        setVehicles(data.vehicles)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/rentals')
      const data = await response.json()
      if (data.success) {
        // Only show active rentals
        setRentals(data.rentals.filter((r: Rental) => r.id))
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadedUrls: string[] = []
      const errors: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          })

          const data = await response.json()

          if (response.ok && data.success) {
            uploadedUrls.push(data.url)
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
          } else {
            errors.push(`${file.name}: ${data.error || 'Unknown error'}`)
            setUploadProgress(prev => {
              const newProgress = { ...prev }
              delete newProgress[file.name]
              return newProgress
            })
          }
        } catch (fileError) {
          errors.push(`${file.name}: Network error`)
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.name]
            return newProgress
          })
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }))

        setToast({
          show: true,
          message: `Successfully uploaded ${uploadedUrls.length} image(s)`,
          type: 'success'
        })
      }

      if (errors.length > 0) {
        setToast({
          show: true,
          message: `Failed to upload ${errors.length} image(s)`,
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setToast({
        show: true,
        message: 'Failed to upload images',
        type: 'error'
      })
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.vehicleId) {
      setToast({
        show: true,
        message: 'Please select a vehicle',
        type: 'error'
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/damages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          repairCost: parseFloat(formData.repairCost) || 0,
          claimAmount: formData.insuranceClaim && formData.claimAmount ? parseFloat(formData.claimAmount) : null,
          rentalId: formData.rentalId || null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToast({
          show: true,
          message: 'Damage reported successfully!',
          type: 'success'
        })

        setTimeout(() => {
          router.push(`${basePath}/damages`)
        }, 1500)
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to report damage',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error reporting damage:', error)
      setToast({
        show: true,
        message: 'An error occurred while reporting damage',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)

  return (
    <>
      <HeaderComponent title="Report Damage" subtitle="Report a new vehicle damage" />

        <main className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Vehicle Selection */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Vehicle Information
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Vehicle *
                      </label>
                      <select
                        name='vehicleId'
                        value={formData.vehicleId}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        <option value=''>Select a vehicle</option>
                        {vehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} - {vehicle.plateNumber}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Related Rental (Optional)
                      </label>
                      <select
                        name='rentalId'
                        value={formData.rentalId}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        <option value=''>Not linked to a rental</option>
                        {rentals.map((rental) => (
                          <option key={rental.id} value={rental.id}>
                            {rental.rentalId} - {rental.customer.name} ({rental.vehicle.name})
                          </option>
                        ))}
                      </select>
                      <p className='text-xs text-gray-500 mt-1'>Link this damage to a specific rental if applicable</p>
                    </div>
                  </div>
                </div>

                {/* Damage Details */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Damage Details
                  </h2>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Severity *
                        </label>
                        <select
                          name='severity'
                          value={formData.severity}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        >
                          <option value='minor'>Minor</option>
                          <option value='moderate'>Moderate</option>
                          <option value='severe'>Severe</option>
                        </select>
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
                          <option value='reported'>Reported</option>
                          <option value='in_repair'>In Repair</option>
                          <option value='repaired'>Repaired</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Description *
                      </label>
                      <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none text-[#000000] placeholder:text-gray-400'
                        placeholder='Describe the damage in detail...'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Reported Date *
                      </label>
                      <input
                        type='date'
                        name='reportedDate'
                        value={formData.reportedDate}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Information */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cost Information
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Estimated Repair Cost ({settings?.currency || 'USD'})
                      </label>
                      <input
                        type='number'
                        name='repairCost'
                        value={formData.repairCost}
                        onChange={handleChange}
                        min='0'
                        step='0.01'
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='0.00'
                      />
                    </div>

                    <div>
                      <label className='flex items-center gap-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          name='insuranceClaim'
                          checked={formData.insuranceClaim}
                          onChange={handleChange}
                          className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                        />
                        <span className='text-sm font-semibold text-[#000000]'>File Insurance Claim</span>
                      </label>
                    </div>

                    {formData.insuranceClaim && (
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Insurance Claim Amount ({settings?.currency || 'USD'})
                        </label>
                        <input
                          type='number'
                          name='claimAmount'
                          value={formData.claimAmount}
                          onChange={handleChange}
                          min='0'
                          step='0.01'
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='0.00'
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Damage Photos */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Damage Photos
                  </h2>

                  <div className='space-y-4'>
                    <label className='block'>
                      <input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className='hidden'
                      />
                      <div className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className='text-sm text-gray-600 mb-1'>
                          <span className='font-semibold text-primary'>Click to upload</span> damage photos
                        </p>
                        <p className='text-xs text-gray-500'>PNG, JPG, WebP up to 5MB</p>
                      </div>
                    </label>

                    {Object.keys(uploadProgress).length > 0 && (
                      <div className='space-y-2'>
                        {Object.entries(uploadProgress).map(([fileName, progress]) => (
                          <div key={fileName} className='bg-gray-50 p-3 rounded-lg'>
                            <div className='flex items-center justify-between mb-2'>
                              <span className='text-sm text-gray-600 truncate'>{fileName}</span>
                              <span className='text-xs text-gray-500'>{progress}%</span>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-2'>
                              <div
                                className='bg-primary h-2 rounded-full transition-all duration-300'
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.images.length > 0 && (
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        {formData.images.map((url, index) => (
                          <div key={index} className='relative group'>
                            <img
                              src={url}
                              alt={`Damage ${index + 1}`}
                              className='w-full h-32 object-cover rounded-lg border-2 border-gray-200'
                            />
                            <button
                              type='button'
                              onClick={() => handleRemoveImage(index)}
                              className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6'>Damage Summary</h2>

                  <div className='space-y-4 mb-6'>
                    {selectedVehicle && (
                      <div className='p-4 border-2 border-primary/20 bg-primary/5 rounded-xl'>
                        <p className='text-xs text-gray-500 mb-1'>Vehicle</p>
                        <p className='font-semibold text-[#000000]'>{selectedVehicle.name}</p>
                        <p className='text-sm text-gray-500'>{selectedVehicle.plateNumber}</p>
                      </div>
                    )}

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-500'>Severity</span>
                        <span className='font-semibold text-[#000000] capitalize'>{formData.severity}</span>
                      </div>

                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-500'>Status</span>
                        <span className='font-semibold text-[#000000] capitalize'>{formData.status.replace('_', ' ')}</span>
                      </div>

                      {formData.repairCost && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-500'>Repair Cost</span>
                          <span className='font-semibold text-primary'>{formatCurrency(parseFloat(formData.repairCost))}</span>
                        </div>
                      )}

                      {formData.insuranceClaim && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-500'>Insurance Claim</span>
                          <span className='font-semibold text-blue-600'>Yes</span>
                        </div>
                      )}

                      {formData.images.length > 0 && (
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>Photos</span>
                          <span className='font-semibold text-[#000000]'>{formData.images.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {loading ? 'Reporting Damage...' : 'Report Damage'}
                    </button>

                    <button
                      type='button'
                      onClick={() => router.push(`${basePath}/damages`)}
                      disabled={loading}
                      className='w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-500 hover:border-primary hover:text-primary font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
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
