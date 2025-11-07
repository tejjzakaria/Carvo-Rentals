'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

interface SharedPageProps {
  basePath: string
  HeaderComponent: React.ComponentType<any>
}

export default function EditRentalPage({ basePath, HeaderComponent }: SharedPageProps) {
  const router = useRouter()
  const params = useParams()
  const rentalId = params.id as string
  const { formatCurrency } = useSettings()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
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
    status: 'pending',
    paymentStatus: 'pending',
    withDriver: false,
    insurance: false
  })

  useEffect(() => {
    fetchRentalAndData()
  }, [rentalId])

  const fetchRentalAndData = async () => {
    try {
      setFetching(true)

      const [rentalRes, customersRes, vehiclesRes] = await Promise.all([
        fetch(`/api/rentals/${rentalId}`),
        fetch('/api/customers'),
        fetch('/api/vehicles')
      ])

      const rentalData = await rentalRes.json()
      const customersData = await customersRes.json()
      const vehiclesData = await vehiclesRes.json()

      if (rentalData.success && rentalData.rental) {
        const rental = rentalData.rental
        setFormData({
          customerId: rental.customerId,
          vehicleId: rental.vehicleId,
          startDate: rental.startDate.split('T')[0],
          endDate: rental.endDate.split('T')[0],
          status: rental.status,
          paymentStatus: rental.paymentStatus || 'pending',
          withDriver: rental.withDriver,
          insurance: rental.insurance
        })
      } else {
        setToast({
          show: true,
          message: 'Rental not found',
          type: 'error'
        })
        setTimeout(() => router.push(`${basePath}/rentals`), 2000)
      }

      if (customersData.success) {
        setCustomers(customersData.customers)
      }

      if (vehiclesData.success) {
        setVehicles(vehiclesData.vehicles)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setToast({
        show: true,
        message: 'Failed to load rental',
        type: 'error'
      })
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    try {
      setLoading(true)

      const response = await fetch(`/api/rentals/${rentalId}`, {
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
          message: 'Rental updated successfully!',
          type: 'success'
        })

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
          message: data.message || data.error || 'Failed to update rental',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error updating rental:', error)
      setToast({
        show: true,
        message: 'An error occurred while updating the rental',
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

      const response = await fetch(`/api/rentals/${rentalId}`, {
        method: 'PUT',
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
          message: 'Rental updated successfully! Maintenance has been cancelled.',
          type: 'success'
        })

        setTimeout(() => {
          router.push(`${basePath}/rentals`)
        }, 1500)
      } else {
        setToast({
          show: true,
          message: data.message || data.error || 'Failed to update rental',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error updating rental:', error)
      setToast({
        show: true,
        message: 'An error occurred while updating the rental',
        type: 'error'
      })
    } finally {
      setLoading(false)
      setMaintenanceConflict(null)
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)
  const selectedCustomer = customers.find(c => c.id === formData.customerId)
  const totalAmount = calculateTotal()
  const days = formData.startDate && formData.endDate
    ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const statusOptions = ['pending', 'active', 'completed', 'cancelled']
  const paymentStatusOptions = ['pending', 'paid', 'refunded']

  if (fetching) {
    return (
      <>
        <HeaderComponent title="Edit Rental" subtitle="Loading..." />
        <div className='flex items-center justify-center bg-[#F5F5F5] min-h-screen'>
          <div className='text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading rental...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <HeaderComponent title="Edit Rental" subtitle="Update rental information" />

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
                    <select
                      name='customerId'
                      value={formData.customerId}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                    >
                      <option value=''>Choose a customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </option>
                      ))}
                    </select>
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
                    <select
                      name='vehicleId'
                      value={formData.vehicleId}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                    >
                      <option value=''>Choose a vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {formatCurrency(vehicle.price)}/day ({vehicle.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedVehicle && (
                    <div className='mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='font-semibold text-[#000000]'>{selectedVehicle.name}</p>
                          <p className='text-sm text-gray-300'>{selectedVehicle.category}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-2xl font-bold text-primary'>{formatCurrency(selectedVehicle.price)}</p>
                          <p className='text-xs text-gray-300'>per day</p>
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
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      />
                    </div>
                  </div>

                  {days > 0 && (
                    <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl'>
                      <p className='text-sm text-blue-800'>
                        <span className='font-bold'>{days}</span> day{days > 1 ? 's' : ''} rental period
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
                        <p className='text-sm text-gray-300'>Additional {formatCurrency(50)} per day</p>
                      </div>
                      {formData.withDriver && (
                        <span className='text-primary font-bold'>+{formatCurrency(50 * days)}</span>
                      )}
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
                        <p className='text-sm text-gray-300'>Additional {formatCurrency(20)} per day</p>
                      </div>
                      {formData.insurance && (
                        <span className='text-primary font-bold'>+{formatCurrency(20 * days)}</span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h2 className='text-xl font-bold text-[#000000] mb-6 flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status
                  </h2>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Rental Status *
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

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Payment Status *
                      </label>
                      <select
                        name='paymentStatus'
                        value={formData.paymentStatus}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        {paymentStatusOptions.map((status) => (
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
                  <h2 className='text-xl font-bold text-[#000000] mb-6'>Rental Summary</h2>

                  <div className='space-y-4 mb-6'>
                    {selectedCustomer && (
                      <div className='p-4 border-2 border-black rounded-xl'>
                        <p className='text-xs text-gray-500 mb-1'>Customer</p>
                        <p className='font-semibold text-[#000000]'>{selectedCustomer.name}</p>
                        <p className='text-sm text-gray-300'>{selectedCustomer.email}</p>
                      </div>
                    )}

                    {selectedVehicle && (
                      <div className='p-4 border-2 border-black rounded-xl'>
                        <p className='text-xs text-gray-500 mb-1'>Vehicle</p>
                        <p className='font-semibold text-[#000000]'>{selectedVehicle.name}</p>
                        <p className='text-sm text-gray-300'>{selectedVehicle.category}</p>
                      </div>
                    )}

                    {days > 0 && (
                      <>
                        <div className='border-t border-gray-200 pt-4'>
                          <div className='flex justify-between text-sm mb-2'>
                            <span className='text-gray-300'>Rental Period</span>
                            <span className='font-semibold text-[#000000]'>{days} day{days > 1 ? 's' : ''}</span>
                          </div>

                          <div className='flex justify-between text-sm mb-2'>
                            <span className='text-gray-300'>Base Price</span>
                            <span className='text-[#000000]'>
                              {formatCurrency(selectedVehicle ? selectedVehicle.price * days : 0)}
                            </span>
                          </div>

                          {formData.withDriver && (
                            <div className='flex justify-between text-sm mb-2'>
                              <span className='text-gray-300'>Driver</span>
                              <span className='text-[#000000]'>+{formatCurrency(50 * days)}</span>
                            </div>
                          )}

                          {formData.insurance && (
                            <div className='flex justify-between text-sm mb-2'>
                              <span className='text-gray-300'>Insurance</span>
                              <span className='text-[#000000]'>+{formatCurrency(20 * days)}</span>
                            </div>
                          )}
                        </div>

                        <div className='border-t border-gray-200 pt-4'>
                          <div className='flex justify-between items-center'>
                            <span className='text-lg font-bold text-[#000000]'>Total Amount</span>
                            <span className='text-3xl font-bold text-primary'>{formatCurrency(totalAmount)}</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between text-sm mb-3'>
                        <span className='text-gray-300'>Rental Status</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          formData.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                          formData.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          formData.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {formData.status}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-300'>Payment Status</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          formData.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                          formData.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-blue-100 text-blue-800 border-blue-200'
                        }`}>
                          {formData.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    >
                      {loading ? 'Updating Rental...' : 'Update Rental'}
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
              This vehicle has scheduled maintenance during the updated rental period. You can override this and cancel the maintenance to proceed with the changes.
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
                className='flex-1 px-6 py-3 bg-gray-100 text-gray-300 font-semibold rounded-xl hover:bg-gray-200 transition-all'
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
