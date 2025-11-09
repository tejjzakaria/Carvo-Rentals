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

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function NewVehiclePage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency, settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    plateNumber: '',
    year: '',
    seats: '',
    transmission: '',
    fuelType: '',
    mileage: '',
    price: '',
    status: 'available',
    featured: false,
    features: [] as string[],
    description: '',
    images: [] as string[]
  })

  const categories = ['Luxury', 'SUV', 'Sedan', 'Electric', 'Sport']
  const transmissionTypes = ['Automatic', 'Manual']
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
  const statusOptions = ['available', 'rented', 'maintenance', 'unavailable']

  const availableFeatures = [
    'GPS Navigation',
    'Bluetooth',
    'Leather Seats',
    'Sunroof',
    'Backup Camera',
    'Cruise Control',
    'USB Ports',
    'Apple CarPlay',
    'Android Auto',
    'Parking Sensors',
    'Heated Seats',
    'Wireless Charging',
    'Premium Sound',
    'Adaptive Cruise Control',
    '360 Camera',
    'Lane Assist',
    'Blind Spot Monitor'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter(f => f !== feature)
        : [...formData.features, feature]
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
            console.error(`Upload failed for ${file.name}:`, data)
            errors.push(`${file.name}: ${data.error || 'Unknown error'}`)
            setUploadProgress(prev => {
              const newProgress = { ...prev }
              delete newProgress[file.name]
              return newProgress
            })
          }
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError)
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
          message: `Failed to upload ${errors.length} image(s). Check console for details.`,
          type: 'error'
        })
        console.error('Upload errors:', errors)
      }

      if (uploadedUrls.length === 0 && errors.length === 0) {
        setToast({
          show: true,
          message: 'No images were uploaded. Please try again.',
          type: 'warning'
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setToast({
        show: true,
        message: 'Failed to upload images. Check console for details.',
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

    try {
      setLoading(true)

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToast({
          show: true,
          message: 'Vehicle added successfully!',
          type: 'success'
        })

        // Wait a bit to show the toast, then redirect
        setTimeout(() => {
          router.push(`${basePath}/vehicles`)
        }, 1500)
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to add vehicle',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      setToast({
        show: true,
        message: 'An error occurred while adding the vehicle',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <HeaderComponent title="Add New Vehicle" subtitle="Add a new vehicle to your fleet" />

        <main className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Basic Information */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Basic Information
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Vehicle Name *
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='e.g., Mercedes-Benz S-Class'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Category *
                        </label>
                        <select
                          name='category'
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        >
                          <option value=''>Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Plate Number *
                        </label>
                        <input
                          type='text'
                          name='plateNumber'
                          value={formData.plateNumber}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='ABC-1234'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Specifications
                  </h2>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Year *
                      </label>
                      <input
                        type='number'
                        name='year'
                        value={formData.year}
                        onChange={handleChange}
                        required
                        min='2000'
                        max='2025'
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='2024'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Seats *
                      </label>
                      <input
                        type='number'
                        name='seats'
                        value={formData.seats}
                        onChange={handleChange}
                        required
                        min='2'
                        max='10'
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='5'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Transmission *
                      </label>
                      <select
                        name='transmission'
                        value={formData.transmission}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        <option value=''>Select transmission</option>
                        {transmissionTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Fuel Type *
                      </label>
                      <select
                        name='fuelType'
                        value={formData.fuelType}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        <option value=''>Select fuel type</option>
                        {fuelTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Mileage (km) *
                      </label>
                      <input
                        type='number'
                        name='mileage'
                        value={formData.mileage}
                        onChange={handleChange}
                        required
                        min='0'
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='15000'
                      />
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

                  {/* Featured Toggle */}
                  <div className='mt-6 pt-6 border-t border-gray-200'>
                    <label className='flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors'>
                      <input
                        type='checkbox'
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                      />
                      <div>
                        <span className='block text-sm font-semibold text-[#000000]'>Featured on Homepage</span>
                        <span className='block text-xs text-gray-500'>Display this vehicle in the featured cars section</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pricing */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pricing
                  </h2>

                  <div>
                    <label className='block text-sm font-semibold text-[#000000] mb-2'>
                      Price Per Day ({settings?.currency || 'USD'}) *
                    </label>
                    <input
                      type='number'
                      name='price'
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min='0'
                      step='10'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                      placeholder='450'
                    />
                  </div>
                </div>

                {/* Features */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Features
                  </h2>

                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {availableFeatures.map((feature) => (
                      <label
                        key={feature}
                        className='flex items-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors'
                      >
                        <input
                          type='checkbox'
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                        />
                        <span className='text-sm text-[#000000]'>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Vehicle Images */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Vehicle Images
                  </h2>

                  <div className='space-y-4'>
                    {/* Upload Button */}
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
                          <span className='font-semibold text-primary'>Click to upload</span> or drag and drop
                        </p>
                        <p className='text-xs text-gray-500'>PNG, JPG, WebP up to 5MB (max 10 images)</p>
                      </div>
                    </label>

                    {/* Upload Progress */}
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

                    {/* Uploaded Images */}
                    {formData.images.length > 0 && (
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        {formData.images.map((url, index) => (
                          <div key={index} className='relative group'>
                            <img
                              src={url}
                              alt={`Vehicle ${index + 1}`}
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
                            {index === 0 && (
                              <span className='absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded'>
                                Primary
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                  </h2>

                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none text-[#000000] placeholder:text-gray-400'
                    placeholder='Add vehicle description or additional notes...'
                  />
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6'>Vehicle Summary</h2>

                  <div className='space-y-4 mb-6'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Vehicle Name</span>
                      <span className='font-semibold text-[#000000] text-right'>
                        {formData.name || '-'}
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Category</span>
                      <span className='font-semibold text-[#000000]'>
                        {formData.category || '-'}
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Plate Number</span>
                      <span className='font-semibold text-[#000000]'>
                        {formData.plateNumber || '-'}
                      </span>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Year</span>
                        <span className='text-[#000000]'>{formData.year || '-'}</span>
                      </div>

                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Seats</span>
                        <span className='text-[#000000]'>{formData.seats || '-'}</span>
                      </div>

                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Transmission</span>
                        <span className='text-[#000000]'>{formData.transmission || '-'}</span>
                      </div>

                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Fuel Type</span>
                        <span className='text-[#000000]'>{formData.fuelType || '-'}</span>
                      </div>

                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Mileage</span>
                        <span className='text-[#000000]'>
                          {formData.mileage ? `${formData.mileage} km` : '-'}
                        </span>
                      </div>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-lg font-bold text-[#000000]'>Price Per Day</span>
                        <span className='text-3xl font-bold text-primary'>
                          {formatCurrency(Number(formData.price) || 0)}
                        </span>
                      </div>
                    </div>

                    {formData.features.length > 0 && (
                      <div className='border-t border-gray-200 pt-4'>
                        <p className='text-sm text-gray-300 mb-2'>
                          Features: <span className='font-semibold text-[#000000]'>{formData.features.length}</span>
                        </p>
                      </div>
                    )}

                    {formData.featured && (
                      <div className='border-t border-gray-200 pt-4'>
                        <div className='flex items-center gap-2 text-sm'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span className='font-semibold text-primary'>Featured on Homepage</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='space-y-3'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
                    </button>

                    <button
                      type='button'
                      onClick={() => router.push(`${basePath}/vehicles`)}
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
