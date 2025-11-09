/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Select, { SingleValue } from 'react-select'
import Toast from '@/components/Toast'
import { useSettings } from '@/contexts/SettingsContext'

interface Customer {
  id: string
  name: string
  email: string
}

interface Vehicle {
  id: string
  name: string
  price: number
  category: string
  status: string
}

interface Damage {
  id: string
  severity: string
  description: string
  images: string[]
}

interface MaintenanceRecord {
  id: string
  maintenanceType: string
  description: string
  scheduledDate: string
  status: string
  cost: number
  serviceProvider: string | null
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface CustomerOption {
  value: string
  label: string
  email: string
}

interface VehicleOption {
  value: string
  label: string
  price: number
  category: string
  status: string
}

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function NewRentalPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null)
  const [vehicleDamages, setVehicleDamages] = useState<Damage[]>([])
  const [damageAcknowledged, setDamageAcknowledged] = useState(false)
  const [maintenanceConflict, setMaintenanceConflict] = useState<MaintenanceRecord[] | null>(null)
  const [showOverrideDialog, setShowOverrideDialog] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  })
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    withDriver: false,
    insurance: false,
    additionalNotes: ''
  })

  useEffect(() => {
    fetchCustomersAndVehicles()
  }, [])

  const fetchCustomersAndVehicles = async () => {
    try {
      const [customersRes, vehiclesRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/vehicles') // Fetch all vehicles, filter on client side
      ])

      const customersData = await customersRes.json()
      const vehiclesData = await vehiclesRes.json()

      if (customersData.success) {
        setCustomers(customersData.customers)
      }

      if (vehiclesData.success) {
        // Include vehicles that are available or have minor/moderate damage
        const rentableStatuses = ['available', 'minor_damage', 'moderate_damage']
        setVehicles(vehiclesData.vehicles.filter((v: Vehicle) => rentableStatuses.includes(v.status)))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setToast({
        show: true,
        message: 'Failed to load customers and vehicles',
        type: 'error'
      })
    }
  }

  const fetchVehicleDamages = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/damages?vehicleId=${vehicleId}&status=reported,in_repair`)
      const data = await response.json()

      if (data.success) {
        setVehicleDamages(data.damages || [])
        setDamageAcknowledged(false) // Reset acknowledgement when vehicle changes
      }
    } catch (error) {
      console.error('Failed to fetch vehicle damages:', error)
      setVehicleDamages([])
    }
  }

  // Create options for react-select
  const customerOptions: CustomerOption[] = customers.map(customer => ({
    value: customer.id,
    label: `${customer.name} - ${customer.email}`,
    email: customer.email
  }))

  const vehicleOptions: VehicleOption[] = vehicles.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.name} - ${formatCurrency(vehicle.price)}/day (${vehicle.category})${
      vehicle.status === 'minor_damage' ? ' ⚠️ Minor Damage' :
      vehicle.status === 'moderate_damage' ? ' ⚠️ Moderate Damage' : ''
    }`,
    price: vehicle.price,
    category: vehicle.category,
    status: vehicle.status
  }))

  const handleCustomerChange = (option: SingleValue<CustomerOption>) => {
    setSelectedCustomer(option)
    setFormData({
      ...formData,
      customerId: option?.value || ''
    })
  }

  const handleVehicleChange = (option: SingleValue<VehicleOption>) => {
    setSelectedVehicle(option)
    setFormData({
      ...formData,
      vehicleId: option?.value || ''
    })

    // Fetch damages when vehicle is selected
    if (option?.value) {
      const vehicle = vehicles.find(v => v.id === option.value)
      if (vehicle && (vehicle.status === 'minor_damage' || vehicle.status === 'moderate_damage')) {
        fetchVehicleDamages(option.value)
      } else {
        setVehicleDamages([])
        setDamageAcknowledged(false)
      }
    } else {
      setVehicleDamages([])
      setDamageAcknowledged(false)
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

  const calculateTotal = () => {
    if (!formData.vehicleId || !formData.startDate || !formData.endDate) return 0

    const vehicle = vehicles.find(v => v.id === formData.vehicleId)
    if (!vehicle) return 0

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 0) return 0

    let total = vehicle.price * days
    if (formData.withDriver) total += 50 * days
    if (formData.insurance) total += 20 * days

    return total
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if vehicle has damages and user hasn't acknowledged
    if (vehicleDamages.length > 0 && !damageAcknowledged) {
      setToast({
        show: true,
        message: 'Please acknowledge the vehicle damage disclaimer before proceeding',
        type: 'warning'
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/rentals', {
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
          message: 'Rental created successfully!',
          type: 'success'
        })

        // Wait a bit to show the toast, then redirect
        setTimeout(() => {
          router.push(`${basePath}/rentals`)
        }, 1500)
      } else if (response.status === 409 && data.error === 'maintenance_conflict') {
        // Show maintenance conflict dialog
        setMaintenanceConflict(data.maintenanceRecords)
        setShowOverrideDialog(true)
      } else {
        setToast({
          show: true,
          message: data.message || data.error || 'Failed to create rental',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error creating rental:', error)
      setToast({
        show: true,
        message: 'An error occurred while creating the rental',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOverrideAndSubmit = async () => {
    setShowOverrideDialog(false)

    try {
      setLoading(true)

      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          overrideMaintenanceConflict: true
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setToast({
          show: true,
          message: 'Rental created successfully! Maintenance has been cancelled.',
          type: 'success'
        })

        // Wait a bit to show the toast, then redirect
        setTimeout(() => {
          router.push(`${basePath}/rentals`)
        }, 1500)
      } else {
        setToast({
          show: true,
          message: data.message || data.error || 'Failed to create rental',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error creating rental:', error)
      setToast({
        show: true,
        message: 'An error occurred while creating the rental',
        type: 'error'
      })
    } finally {
      setLoading(false)
      setMaintenanceConflict(null)
    }
  }

  const currentVehicle = vehicles.find(v => v.id === formData.vehicleId)
  const totalAmount = calculateTotal()
  const days = formData.startDate && formData.endDate
    ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <>
      <HeaderComponent title="Add New Rental" subtitle="Create a new rental booking" />

        <main className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Main Form */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Customer Information */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h2>

                  <div>
                    <label className='block text-sm font-semibold text-[#000000] mb-2'>
                      Select Customer *
                    </label>
                    <Select
                      value={selectedCustomer}
                      onChange={handleCustomerChange}
                      options={customerOptions}
                      placeholder="Search and select a customer..."
                      isClearable
                      isSearchable
                      className='react-select-container'
                      classNamePrefix='react-select'
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '48px',
                          borderRadius: '0.75rem',
                          borderWidth: '2px',
                          borderColor: '#E5E7EB',
                          '&:hover': {
                            borderColor: '#8B5CF6'
                          }
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '0.75rem',
                          overflow: 'hidden'
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected ? '#8B5CF6' : state.isFocused ? '#EDE9FE' : 'white',
                          color: state.isSelected ? 'white' : '#000000',
                          '&:active': {
                            backgroundColor: '#8B5CF6'
                          }
                        })
                      }}
                    />
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Vehicle Selection
                  </h2>

                  <div>
                    <label className='block text-sm font-semibold text-[#000000] mb-2'>
                      Select Vehicle *
                    </label>
                    <Select
                      value={selectedVehicle}
                      onChange={handleVehicleChange}
                      options={vehicleOptions}
                      placeholder="Search and select a vehicle..."
                      isClearable
                      isSearchable
                      className='react-select-container'
                      classNamePrefix='react-select'
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: '48px',
                          borderRadius: '0.75rem',
                          borderWidth: '2px',
                          borderColor: '#E5E7EB',
                          '&:hover': {
                            borderColor: '#8B5CF6'
                          }
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '0.75rem',
                          overflow: 'hidden'
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected ? '#8B5CF6' : state.isFocused ? '#EDE9FE' : 'white',
                          color: state.isSelected ? 'white' : '#000000',
                          '&:active': {
                            backgroundColor: '#8B5CF6'
                          }
                        })
                      }}
                    />
                  </div>

                  {currentVehicle && (
                    <div className='mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='font-semibold text-[#000000]'>{currentVehicle.name}</p>
                          <p className='text-sm text-gray-300'>{currentVehicle.category}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-2xl font-bold text-primary'>{formatCurrency(currentVehicle.price)}</p>
                          <p className='text-xs text-gray-300'>per day</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Damage Disclaimer */}
                  {vehicleDamages.length > 0 && (
                    <div className='mt-4 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl'>
                      <div className='flex items-start gap-3 mb-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className='flex-1'>
                          <h3 className='text-lg font-bold text-yellow-900 mb-2'>Vehicle Damage Disclosure</h3>
                          <p className='text-sm text-yellow-800 mb-3'>
                            This vehicle has reported damage. Please review the details below before proceeding with the rental.
                          </p>

                          <div className='space-y-3'>
                            {vehicleDamages.map((damage, index) => (
                              <div key={damage.id} className='bg-white p-4 rounded-lg border border-yellow-200'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                                    damage.severity === 'severe' ? 'bg-red-100 text-red-800 border-red-200' :
                                    damage.severity === 'moderate' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                    'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  }`}>
                                    {damage.severity.charAt(0).toUpperCase() + damage.severity.slice(1)} Damage
                                  </span>
                                </div>
                                <p className='text-sm text-gray-700'>{damage.description}</p>
                                {damage.images && damage.images.length > 0 && (
                                  <div className='mt-3 flex gap-2 overflow-x-auto'>
                                    {damage.images.slice(0, 3).map((image, imgIndex) => (
                                      <img
                                        key={imgIndex}
                                        src={image}
                                        alt={`Damage ${imgIndex + 1}`}
                                        className='w-20 h-20 object-cover rounded border border-gray-200'
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <label className='flex items-start gap-3 mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-200 transition-colors'>
                            <input
                              type='checkbox'
                              checked={damageAcknowledged}
                              onChange={(e) => setDamageAcknowledged(e.target.checked)}
                              className='w-5 h-5 text-yellow-600 border-yellow-400 rounded focus:ring-2 focus:ring-yellow-500 mt-0.5'
                            />
                            <span className='text-sm text-yellow-900 font-medium'>
                              I acknowledge that this vehicle has existing damage as described above, and I understand that the customer will be informed of this condition before pickup.
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rental Period */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Rental Period
                  </h2>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Start Date *
                      </label>
                      <input
                        type='date'
                        name='startDate'
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        End Date *
                      </label>
                      <input
                        type='date'
                        name='endDate'
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      />
                    </div>
                  </div>

                  {days > 0 && (
                    <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl'>
                      <p className='text-sm text-blue-800 font-medium'>
                        Total Duration: <span className='font-bold'>{days} {days === 1 ? 'day' : 'days'}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Options */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Additional Options
                  </h2>

                  <div className='space-y-4'>
                    <label className='flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors'>
                      <input
                        type='checkbox'
                        name='withDriver'
                        checked={formData.withDriver}
                        onChange={handleChange}
                        className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                      />
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>With Driver</p>
                        <p className='text-sm text-gray-300'>Professional driver service (+{formatCurrency(50)}/day)</p>
                      </div>
                    </label>

                    <label className='flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors'>
                      <input
                        type='checkbox'
                        name='insurance'
                        checked={formData.insurance}
                        onChange={handleChange}
                        className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                      />
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Insurance Coverage</p>
                        <p className='text-sm text-gray-300'>Full coverage insurance (+{formatCurrency(20)}/day)</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Additional Notes
                  </h2>

                  <textarea
                    name='additionalNotes'
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows={4}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none text-[#000000] placeholder:text-gray-400'
                    placeholder='Add any special requests or notes...'
                  />
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6'>Booking Summary</h2>

                  <div className='space-y-4 mb-6'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Vehicle</span>
                      <span className='font-semibold text-[#000000]'>
                        {currentVehicle ? currentVehicle.name : '-'}
                      </span>
                    </div>

                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-300'>Duration</span>
                      <span className='font-semibold text-[#000000]'>
                        {days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '-'}
                      </span>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-300'>Vehicle rental</span>
                        <span className='text-[#000000]'>
                          {currentVehicle && days > 0 ? formatCurrency(currentVehicle.price * days) : formatCurrency(0)}
                        </span>
                      </div>

                      {formData.withDriver && days > 0 && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-300'>Driver service</span>
                          <span className='text-[#000000]'>{formatCurrency(50 * days)}</span>
                        </div>
                      )}

                      {formData.insurance && days > 0 && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-300'>Insurance</span>
                          <span className='text-[#000000]'>{formatCurrency(20 * days)}</span>
                        </div>
                      )}
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-lg font-bold text-[#000000]'>Total</span>
                        <span className='text-3xl font-bold text-primary'>{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {loading ? 'Creating Rental...' : 'Create Rental'}
                    </button>

                    <button
                      type='button'
                      onClick={() => router.push(`${basePath}/rentals`)}
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
      {/* Maintenance Conflict Override Dialog */}
      {showOverrideDialog && maintenanceConflict && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => {
              setShowOverrideDialog(false)
              setMaintenanceConflict(null)
            }}
          />

          {/* Dialog */}
          <div className='relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 animate-in fade-in zoom-in duration-200 max-h-[80vh] overflow-y-auto'>
            {/* Icon */}
            <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8 text-orange-600' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className='text-xl font-bold text-[#000000] text-center mb-2'>
              Maintenance Scheduled During Rental Period
            </h3>

            {/* Message */}
            <p className='text-gray-300 text-center mb-6'>
              This vehicle has scheduled maintenance during the selected rental period. You can override this and cancel the maintenance to proceed with the rental.
            </p>

            {/* Maintenance Records */}
            <div className='mb-6 space-y-3'>
              <h4 className='font-semibold text-[#000000] mb-3'>Conflicting Maintenance:</h4>
              {maintenanceConflict.map((maintenance) => (
                <div key={maintenance.id} className='bg-orange-50 border-2 border-orange-200 rounded-xl p-4'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200'>
                          {maintenance.maintenanceType.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          maintenance.status === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {maintenance.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className='text-sm text-gray-300 mb-2'>{maintenance.description}</p>
                      <div className='grid grid-cols-2 gap-2 text-xs text-gray-300'>
                        <div>
                          <span className='font-semibold'>Scheduled:</span>{' '}
                          {new Date(maintenance.scheduledDate).toLocaleDateString()}
                        </div>
                        {maintenance.serviceProvider && (
                          <div>
                            <span className='font-semibold'>Provider:</span> {maintenance.serviceProvider}
                          </div>
                        )}
                        <div>
                          <span className='font-semibold'>Cost:</span> {formatCurrency(maintenance.cost)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className='bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6'>
              <p className='text-sm text-red-800 font-medium'>
                ⚠️ Warning: Overriding will <strong>permanently cancel</strong> the scheduled maintenance record(s). This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setShowOverrideDialog(false)
                  setMaintenanceConflict(null)
                }}
                className='flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all'
              >
                Cancel
              </button>
              <button
                onClick={handleOverrideAndSubmit}
                disabled={loading}
                className='flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Processing...' : 'Override & Continue'}
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
