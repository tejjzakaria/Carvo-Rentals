/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import Select from 'react-select'

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  vehicle: {
    id: string
    name: string
    price: number
    category: string
    images: string[]
  } | null
  currency: string
}

const BookingDialog = ({ isOpen, onClose, vehicle, currency }: BookingDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    startDate: '',
    endDate: '',
    withDriver: false,
    insurance: false,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [locations, setLocations] = useState<{ value: string; label: string }[]>([])
  const [selectedLocation, setSelectedLocation] = useState<{ value: string; label: string } | null>(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    checking: boolean
    available: boolean | null
    message: string
  }>({ checking: false, available: null, message: '' })
  const [conflictingRentals, setConflictingRentals] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchLocations()
    }
  }, [isOpen])

  useEffect(() => {
    calculateTotal()
  }, [formData.startDate, formData.endDate, formData.withDriver, formData.insurance, vehicle])

  useEffect(() => {
    if (formData.startDate && formData.endDate && vehicle) {
      checkAvailability()
    } else {
      setAvailabilityStatus({ checking: false, available: null, message: '' })
    }
  }, [formData.startDate, formData.endDate, vehicle])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations?activeOnly=true')
      const data = await response.json()
      if (data.success) {
        const options = data.locations.map((loc: any) => ({
          value: loc.name,
          label: loc.name
        }))
        setLocations(options)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate || !vehicle) return

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 0) {
      setTotalAmount(0)
      return
    }

    let total = vehicle.price * days
    if (formData.withDriver) total += 50 * days // Add driver cost per day
    if (formData.insurance) total += 20 * days // Add insurance cost per day

    setTotalAmount(total)
  }

  const checkAvailability = async () => {
    if (!vehicle || !formData.startDate || !formData.endDate) return

    setAvailabilityStatus({ checking: true, available: null, message: 'Checking availability...' })

    try {
      const response = await fetch(
        `/api/vehicles/${vehicle.id}/availability?startDate=${formData.startDate}&endDate=${formData.endDate}`
      )

      console.log('Availability check response status:', response.status)

      if (!response.ok) {
        console.error('Availability check failed with status:', response.status)
        setAvailabilityStatus({
          checking: false,
          available: null,
          message: 'Could not check availability. Please try again.'
        })
        return
      }

      const data = await response.json()
      console.log('Availability check data:', data)

      if (data.success) {
        if (data.available) {
          setAvailabilityStatus({
            checking: false,
            available: true,
            message: 'Vehicle is available for selected dates'
          })
          setConflictingRentals([])
        } else {
          const conflicts = data.conflictingRentals || []
          setConflictingRentals(conflicts)
          setAvailabilityStatus({
            checking: false,
            available: false,
            message: `Vehicle is not available. There are ${conflicts.length} conflicting rental(s).`
          })
        }
      } else {
        setAvailabilityStatus({
          checking: false,
          available: null,
          message: data.error || 'Could not check availability.'
        })
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      setAvailabilityStatus({
        checking: false,
        available: null,
        message: 'Could not check availability. Please try again.'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if dates are available
    if (availabilityStatus.available === false) {
      setMessage({ type: 'error', text: 'Please select different dates. The vehicle is not available for the selected period.' })
      return
    }

    setLoading(true)
    setMessage(null)

    if (!vehicle) return

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerLocation: selectedLocation?.value || formData.location,
          startDate: formData.startDate,
          endDate: formData.endDate,
          withDriver: formData.withDriver,
          insurance: formData.insurance,
          notes: formData.notes,
          totalAmount
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Booking request submitted successfully! We will contact you shortly.' })
        setTimeout(() => {
          onClose()
          resetForm()
        }, 2000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit booking' })
      }
    } catch (error) {
      console.error('Booking error:', error)
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      startDate: '',
      endDate: '',
      withDriver: false,
      insurance: false,
      notes: ''
    })
    setSelectedLocation(null)
    setTotalAmount(0)
    setMessage(null)
    setAvailabilityStatus({ checking: false, available: null, message: '' })
    setConflictingRentals([])
  }

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'white',
      borderColor: state.isFocused ? 'rgba(255, 107, 53, 1)' : 'rgba(229, 231, 235, 1)',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      minHeight: '44px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(255, 107, 53, 0.1)' : 'none',
      '&:hover': {
        borderColor: 'rgba(255, 107, 53, 0.5)'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 100
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'rgba(255, 107, 53, 0.1)'
        : state.isFocused
        ? 'rgba(255, 107, 53, 0.05)'
        : 'white',
      color: '#1a2332',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgba(255, 107, 53, 0.2)'
      }
    })
  }

  if (!isOpen || !vehicle) return null

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-gradient-to-r from-primary via-primary-dark to-primary-light text-white p-6 rounded-t-3xl'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-3xl font-bold mb-2'>Book Your Ride</h2>
              <p className='text-white/90'>Complete the form below to reserve {vehicle.name}</p>
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className='p-6  border-b'>
          <div className='flex gap-6 items-center'>
            {vehicle.images && vehicle.images.length > 0 ? (
              <img src={vehicle.images[0]} alt={vehicle.name} className='w-32 h-24 object-cover rounded-xl shadow-lg' />
            ) : (
              <div className='w-32 h-24 bg-gray-200 rounded-xl flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            )}
            <div className='flex-1'>
              <h3 className='text-2xl font-bold text-gray-300'>{vehicle.name}</h3>
              <div className='flex items-center gap-4 mt-2'>
                <span className='px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold'>{vehicle.category}</span>
                <span className='text-2xl font-bold text-primary'>{currency} {vehicle.price}<span className='text-sm text-gray-500'>/day</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Customer Information */}
          <div>
            <h4 className='text-lg font-bold text-gray-300 mb-4 flex items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Information
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Full Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none'
                  placeholder='John Doe'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none'
                  placeholder='john@example.com'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Phone <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none'
                  placeholder='+1 234 567 8900'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Location <span className='text-red-500'>*</span>
                </label>
                <Select
                  instanceId='booking-location'
                  value={selectedLocation}
                  onChange={(option) => {
                    setSelectedLocation(option)
                    setFormData({ ...formData, location: option?.value || '' })
                  }}
                  options={locations}
                  styles={customSelectStyles}
                  placeholder='Select your location'
                  isClearable
                  required
                />
              </div>
            </div>
          </div>

          {/* Rental Dates */}
          <div>
            <h4 className='text-lg font-bold text-gray-300 mb-4 flex items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Rental Period
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Start Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  required
                  min={today}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none [color-scheme:light]'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  End Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  required
                  min={formData.startDate || today}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none [color-scheme:light]'
                />
              </div>
            </div>

            {/* Availability Status */}
            {availabilityStatus.message && (
              <div className={`mt-4 p-4 rounded-lg border-2 flex items-start gap-3 ${
                availabilityStatus.available === true
                  ? 'bg-green-50 border-green-200'
                  : availabilityStatus.available === false
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                {availabilityStatus.checking ? (
                  <svg className="animate-spin h-5 w-5 text-blue-600 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : availabilityStatus.available === true ? (
                  <svg className="h-5 w-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : availabilityStatus.available === false ? (
                  <svg className="h-5 w-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : null}
                <div className='flex-1'>
                  <p className={`font-semibold ${
                    availabilityStatus.available === true
                      ? 'text-green-700'
                      : availabilityStatus.available === false
                      ? 'text-red-700'
                      : 'text-blue-700'
                  }`}>
                    {availabilityStatus.message}
                  </p>
                  {conflictingRentals.length > 0 && (
                    <div className='mt-2 text-sm text-red-600'>
                      <p className='font-semibold mb-1'>Conflicting rentals:</p>
                      <ul className='list-disc list-inside space-y-1'>
                        {conflictingRentals.map((rental, index) => (
                          <li key={index}>
                            {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                            {' '}({rental.status})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div>
            <h4 className='text-lg font-bold text-gray-300 mb-4 flex items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Additional Services
            </h4>
            <div className='space-y-4'>
              <label className='flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-primary/50 transition-all cursor-pointer group'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-300'>With Driver</p>
                    <p className='text-sm text-gray-500'>+{currency}50/day</p>
                  </div>
                </div>
                <input
                  type='checkbox'
                  checked={formData.withDriver}
                  onChange={(e) => setFormData({ ...formData, withDriver: e.target.checked })}
                  className='w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer'
                />
              </label>

              <label className='flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-primary/50 transition-all cursor-pointer group'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-300'>Insurance Coverage</p>
                    <p className='text-sm text-gray-500'>+{currency}20/day</p>
                  </div>
                </div>
                <input
                  type='checkbox'
                  checked={formData.insurance}
                  onChange={(e) => setFormData({ ...formData, insurance: e.target.checked })}
                  className='w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer'
                />
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className='block text-sm font-semibold text-gray-300 mb-2'>
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none resize-none'
              placeholder='Any special requests or requirements?'
            />
          </div>

          {/* Total Amount */}
          {totalAmount > 0 && (
            <div className='bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-gray-600 mb-1'>Estimated Total</p>
                  <p className='text-4xl font-bold text-primary'>{currency}{totalAmount.toFixed(2)}</p>
                </div>
                <div className='text-right text-sm text-gray-600'>
                  <p>Base: {currency}{vehicle.price} × {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                  {formData.withDriver && <p>Driver: +{currency}{50 * Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))}</p>}
                  {formData.insurance && <p>Insurance: +{currency}{20 * Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <p className='font-semibold'>{message.text}</p>
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-4 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-300 font-bold hover:bg-gray-50 hover:text-white transition-all'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading || !selectedLocation || availabilityStatus.available === false || availabilityStatus.checking}
              className='flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary via-primary-dark to-primary-light text-white font-bold hover:shadow-xl hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Submitting...' : availabilityStatus.checking ? 'Checking availability...' : 'Submit Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingDialog
