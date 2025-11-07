'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface Vehicle {
  id: string
  name: string
  category: string
  plateNumber: string
  year: number
  seats: number
  transmission: string
  fuelType: string
  mileage: number
  price: number
  status: string
  features: string[]
  description: string | null
  images: string[]
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

export default function ViewVehiclePage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const params = useParams()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })

  useEffect(() => {
    fetchVehicle()
  }, [vehicleId])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      const data = await response.json()

      if (data.success && data.vehicle) {
        setVehicle(data.vehicle)
      } else {
        setToast({
          show: true,
          message: 'Vehicle not found',
          type: 'error'
        })
        setTimeout(() => router.push(`${basePath}/vehicles`), 2000)
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      setToast({
        show: true,
        message: 'Failed to load vehicle',
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
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rented':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <>
        <HeaderComponent title="Vehicle Details" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading vehicle...</p>
          </div>
        </div>
      </>
    )
  }

  if (!vehicle) {
    return null
  }

  return (
    <>
      <HeaderComponent
          title="Vehicle Details"
          subtitle={vehicle.name}
          actionButton={{
            label: 'Edit Vehicle',
            onClick: () => router.push(`${basePath}/vehicles/${vehicle.id}/edit`),
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
              {/* Vehicle Images */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
                {vehicle.images && vehicle.images.length > 0 ? (
                  <div className='relative'>
                    <div className='h-80 overflow-hidden'>
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='absolute top-4 right-4'>
                      <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border backdrop-blur-sm ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </div>
                    {vehicle.images.length > 1 && (
                      <div className='p-4 grid grid-cols-4 gap-2'>
                        {vehicle.images.slice(1, 5).map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`${vehicle.name} ${index + 2}`}
                            className='w-full h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer'
                          />
                        ))}
                        {vehicle.images.length > 5 && (
                          <div className='w-full h-20 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center'>
                            <span className='text-sm font-semibold text-gray-600'>+{vehicle.images.length - 5}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative'>
                    <div className='absolute top-4 right-4'>
                      <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Vehicle Information */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vehicle Information
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Vehicle Name</p>
                    <p className='font-semibold text-[#000000] text-lg'>{vehicle.name}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Category</p>
                    <span className='inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary border border-primary/20'>
                      {vehicle.category}
                    </span>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Plate Number</p>
                    <p className='font-semibold text-[#000000]'>{vehicle.plateNumber}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Year</p>
                    <p className='font-semibold text-[#000000]'>{vehicle.year}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Seats</p>
                    <p className='font-semibold text-[#000000]'>{vehicle.seats} Seats</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Transmission</p>
                    <p className='font-semibold text-[#000000]'>{vehicle.transmission}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Fuel Type</p>
                    <p className='font-semibold text-[#000000]'>{vehicle.fuelType}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Mileage</p>
                    <p className='font-semibold text-[#000000]'>{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                </div>

                {vehicle.description && (
                  <div className='mt-6 pt-6 border-t border-gray-200'>
                    <p className='text-sm text-gray-500 mb-2'>Description</p>
                    <p className='text-[#000000]'>{vehicle.description}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Features
                </h2>

                {vehicle.features && vehicle.features.length > 0 ? (
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className='flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className='text-sm font-medium text-green-800'>{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500'>No features listed</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                <h2 className='text-xl font-bold text-[#000000] mb-6'>Pricing & Status</h2>

                <div className='mb-6'>
                  <p className='text-sm text-gray-500 mb-2'>Daily Rate</p>
                  <p className='text-4xl font-bold text-primary'>{formatCurrency(vehicle.price)}</p>
                  <p className='text-sm text-gray-500'>per day</p>
                </div>

                <div className='mb-6 pb-6 border-b border-gray-200'>
                  <p className='text-sm text-gray-500 mb-2'>Current Status</p>
                  <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </div>

                <div className='space-y-3 mb-6'>
                  <button
                    onClick={() => router.push(`${basePath}/vehicles/${vehicle.id}/edit`)}
                    className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                  >
                    Edit Vehicle
                  </button>

                  {vehicle.status === 'available' && (
                    <button
                      onClick={() => router.push(`${basePath}/rentals/new`)}
                      className='w-full px-6 py-4 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-xl transition-all'
                    >
                      Create Rental
                    </button>
                  )}

                  <button
                    onClick={() => {
                      localStorage.setItem('preselectedVehicleId', vehicle.id)
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
                    onClick={() => {
                      localStorage.setItem('preselectedVehicleId', vehicle.id)
                      router.push(`${basePath}/maintenance/new`)
                    }}
                    className='w-full px-6 py-4 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    Schedule Maintenance
                  </button>

                  <button
                    onClick={() => router.push(`${basePath}/vehicles`)}
                    className='w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-xl transition-all'
                  >
                    Back to Vehicles
                  </button>
                </div>

                <div className='border-t border-gray-200 pt-4'>
                  <div className='text-xs text-gray-500'>
                    <p className='mb-1'><span className='font-semibold'>Created:</span> {formatDate(vehicle.createdAt)}</p>
                    <p><span className='font-semibold'>Updated:</span> {formatDate(vehicle.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Specifications Card */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-6'>Quick Specs</h2>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Year</span>
                    <span className='font-semibold text-[#000000]'>{vehicle.year}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Seats</span>
                    <span className='font-semibold text-[#000000]'>{vehicle.seats}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Transmission</span>
                    <span className='font-semibold text-[#000000]'>{vehicle.transmission}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Fuel Type</span>
                    <span className='font-semibold text-[#000000]'>{vehicle.fuelType}</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Mileage</span>
                    <span className='font-semibold text-[#000000]'>{vehicle.mileage.toLocaleString()} km</span>
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
