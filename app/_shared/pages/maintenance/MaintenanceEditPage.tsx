'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface Vehicle {
  id: string
  name: string
  plateNumber: string
  category: string
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

export default function EditMaintenancePage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const params = useParams()
  const maintenanceId = params.id as string
  const { formatCurrency, settings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    vehicleId: '',
    maintenanceType: 'oil_change',
    description: '',
    cost: '',
    serviceProvider: '',
    status: 'scheduled',
    scheduledDate: '',
    completedDate: '',
    mileageAtService: '',
    nextServiceDue: '',
    notes: ''
  })

  useEffect(() => {
    fetchVehicles()
    fetchMaintenance()
  }, [maintenanceId])

  const fetchMaintenance = async () => {
    try {
      setFetching(true)
      const response = await fetch(`/api/maintenance/${maintenanceId}`)
      const data = await response.json()

      if (data.success && data.maintenance) {
        const maintenance = data.maintenance
        setFormData({
          vehicleId: maintenance.vehicleId,
          maintenanceType: maintenance.maintenanceType,
          description: maintenance.description,
          cost: maintenance.cost.toString(),
          serviceProvider: maintenance.serviceProvider || '',
          status: maintenance.status,
          scheduledDate: maintenance.scheduledDate.split('T')[0],
          completedDate: maintenance.completedDate ? maintenance.completedDate.split('T')[0] : '',
          mileageAtService: maintenance.mileageAtService ? maintenance.mileageAtService.toString() : '',
          nextServiceDue: maintenance.nextServiceDue ? maintenance.nextServiceDue.split('T')[0] : '',
          notes: maintenance.notes || ''
        })
      } else {
        setToast({
          show: true,
          message: 'Maintenance record not found',
          type: 'error'
        })
        setTimeout(() => router.push(`${basePath}/maintenance`), 2000)
      }
    } catch (error) {
      console.error('Error fetching maintenance:', error)
      setToast({
        show: true,
        message: 'Failed to load maintenance record',
        type: 'error'
      })
    } finally {
      setFetching(false)
    }
  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
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

      const response = await fetch(`/api/maintenance/${maintenanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maintenanceType: formData.maintenanceType,
          description: formData.description,
          cost: parseFloat(formData.cost) || 0,
          serviceProvider: formData.serviceProvider || null,
          status: formData.status,
          scheduledDate: formData.scheduledDate,
          completedDate: formData.completedDate || null,
          mileageAtService: formData.mileageAtService ? parseInt(formData.mileageAtService) : null,
          nextServiceDue: formData.nextServiceDue || null,
          notes: formData.notes || null
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToast({
          show: true,
          message: 'Maintenance updated successfully!',
          type: 'success'
        })

        setTimeout(() => {
          router.push(`${basePath}/maintenance`)
        }, 1500)
      } else {
        setToast({
          show: true,
          message: data.error || 'Failed to update maintenance',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error updating maintenance:', error)
      setToast({
        show: true,
        message: 'An error occurred while updating maintenance',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)

  const maintenanceTypes = [
    { value: 'oil_change', label: 'Oil Change' },
    { value: 'tire_rotation', label: 'Tire Rotation' },
    { value: 'brake_service', label: 'Brake Service' },
    { value: 'battery_replacement', label: 'Battery Replacement' },
    { value: 'air_filter', label: 'Air Filter Replacement' },
    { value: 'transmission', label: 'Transmission Service' },
    { value: 'coolant_flush', label: 'Coolant Flush' },
    { value: 'inspection', label: 'General Inspection' },
    { value: 'alignment', label: 'Wheel Alignment' },
    { value: 'ac_service', label: 'AC Service' },
    { value: 'other', label: 'Other' }
  ]

  if (fetching) {
    return (
      <>
        <HeaderComponent title="Edit Maintenance" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading maintenance...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HeaderComponent title="Edit Maintenance" subtitle="Update maintenance information" />

        <main className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Vehicle Information */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Vehicle Information
                  </h2>

                  <div>
                    <label className='block text-sm font-semibold text-[#000000] mb-2'>
                      Vehicle
                    </label>
                    <input
                      type='text'
                      value={selectedVehicle ? `${selectedVehicle.name} - ${selectedVehicle.plateNumber}` : 'Loading...'}
                      disabled
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed'
                    />
                    <p className='text-xs text-gray-500 mt-1'>Vehicle cannot be changed</p>
                  </div>
                </div>

                {/* Maintenance Details */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Maintenance Details
                  </h2>

                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Maintenance Type *
                        </label>
                        <select
                          name='maintenanceType'
                          value={formData.maintenanceType}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        >
                          {maintenanceTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
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
                          <option value='scheduled'>Scheduled</option>
                          <option value='in_progress'>In Progress</option>
                          <option value='completed'>Completed</option>
                          <option value='cancelled'>Cancelled</option>
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
                        placeholder='Describe the maintenance work...'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Service Provider
                        </label>
                        <input
                          type='text'
                          name='serviceProvider'
                          value={formData.serviceProvider}
                          onChange={handleChange}
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='e.g., AutoFix Garage'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Cost ({settings?.currency || 'USD'})
                        </label>
                        <input
                          type='number'
                          name='cost'
                          value={formData.cost}
                          onChange={handleChange}
                          min='0'
                          step='0.01'
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='0.00'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Scheduled Date *
                        </label>
                        <input
                          type='date'
                          name='scheduledDate'
                          value={formData.scheduledDate}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        />
                      </div>

                      {formData.status === 'completed' && (
                        <div>
                          <label className='block text-sm font-semibold text-[#000000] mb-2'>
                            Completed Date
                          </label>
                          <input
                            type='date'
                            name='completedDate'
                            value={formData.completedDate}
                            onChange={handleChange}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                          />
                        </div>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Mileage at Service
                        </label>
                        <input
                          type='number'
                          name='mileageAtService'
                          value={formData.mileageAtService}
                          onChange={handleChange}
                          min='0'
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='e.g., 50000'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Next Service Due
                        </label>
                        <input
                          type='date'
                          name='nextServiceDue'
                          value={formData.nextServiceDue}
                          onChange={handleChange}
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Additional Notes
                      </label>
                      <textarea
                        name='notes'
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none text-[#000000] placeholder:text-gray-400'
                        placeholder='Any additional notes or observations...'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6'>Maintenance Summary</h2>

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
                        <span className='text-gray-500'>Type</span>
                        <span className='font-semibold text-[#000000]'>
                          {maintenanceTypes.find(t => t.value === formData.maintenanceType)?.label}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-500'>Status</span>
                        <span className='font-semibold text-[#000000] capitalize'>{formData.status.replace('_', ' ')}</span>
                      </div>

                      {formData.cost && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-500'>Cost</span>
                          <span className='font-semibold text-primary'>{formatCurrency(parseFloat(formData.cost))}</span>
                        </div>
                      )}

                      {formData.serviceProvider && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-500'>Provider</span>
                          <span className='font-semibold text-[#000000] text-right'>{formData.serviceProvider}</span>
                        </div>
                      )}

                      {formData.scheduledDate && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-500'>Scheduled</span>
                          <span className='font-semibold text-[#000000]'>
                            {new Date(formData.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {formData.mileageAtService && (
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>Mileage</span>
                          <span className='font-semibold text-[#000000]'>{parseInt(formData.mileageAtService).toLocaleString()} km</span>
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
                      {loading ? 'Updating Maintenance...' : 'Update Maintenance'}
                    </button>

                    <button
                      type='button'
                      onClick={() => router.push(`${basePath}/maintenance`)}
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
