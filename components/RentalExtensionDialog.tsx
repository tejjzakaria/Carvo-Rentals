/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useSettings } from '@/contexts/SettingsContext'

interface RentalExtensionDialogProps {
  isOpen: boolean
  onClose: () => void
  rental: {
    id: string
    rentalId: string
    vehicleId: string
    endDate: string
    totalAmount: number
    withDriver: boolean
    insurance: boolean
    vehicle: {
      name: string
      price: number
    }
  } | null
  onSuccess: () => void
}

const RentalExtensionDialog = ({ isOpen, onClose, rental, onSuccess }: RentalExtensionDialogProps) => {
  const { formatCurrency } = useSettings()
  const [newEndDate, setNewEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    checking: boolean
    available: boolean | null
    message: string
  }>({ checking: false, available: null, message: '' })
  const [conflictingRentals, setConflictingRentals] = useState<any[]>([])
  const [additionalCost, setAdditionalCost] = useState(0)

  useEffect(() => {
    if (isOpen && rental) {
      // Set minimum date to the day after current end date
      const currentEnd = new Date(rental.endDate)
      const minDate = new Date(currentEnd.setDate(currentEnd.getDate() + 1))
      setNewEndDate(minDate.toISOString().split('T')[0])
    }
  }, [isOpen, rental])

  useEffect(() => {
    if (newEndDate && rental) {
      checkAvailability()
      calculateAdditionalCost()
    }
  }, [newEndDate, rental])

  const checkAvailability = async () => {
    if (!rental || !newEndDate) return

    setAvailabilityStatus({ checking: true, available: null, message: 'Checking availability...' })

    try {
      const currentEndDate = new Date(rental.endDate).toISOString().split('T')[0]
      const nextDay = new Date(rental.endDate)
      nextDay.setDate(nextDay.getDate() + 1)
      const startDate = nextDay.toISOString().split('T')[0]

      const response = await fetch(
        `/api/vehicles/${rental.vehicleId}/availability?startDate=${startDate}&endDate=${newEndDate}`
      )

      if (!response.ok) {
        setAvailabilityStatus({
          checking: false,
          available: null,
          message: 'Could not check availability. Please try again.'
        })
        return
      }

      const data = await response.json()

      if (data.success) {
        if (data.available) {
          setAvailabilityStatus({
            checking: false,
            available: true,
            message: 'Vehicle is available for extension'
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

  const calculateAdditionalCost = () => {
    if (!rental || !newEndDate) return

    const currentEnd = new Date(rental.endDate)
    const newEnd = new Date(newEndDate)
    const additionalDays = Math.ceil((newEnd.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24))

    if (additionalDays <= 0) {
      setAdditionalCost(0)
      return
    }

    let cost = rental.vehicle.price * additionalDays
    if (rental.withDriver) cost += 50 * additionalDays
    if (rental.insurance) cost += 20 * additionalDays

    setAdditionalCost(cost)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (availabilityStatus.available === false) {
      setMessage({ type: 'error', text: 'Cannot extend rental - vehicle is not available for the selected dates.' })
      return
    }

    if (!rental || !newEndDate) return

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/rentals/${rental.id}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newEndDate,
          additionalCost
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Rental extended successfully!' })
        setTimeout(() => {
          onSuccess()
          onClose()
          resetForm()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to extend rental' })
      }
    } catch (error) {
      console.error('Extension error:', error)
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewEndDate('')
    setAdditionalCost(0)
    setMessage(null)
    setAvailabilityStatus({ checking: false, available: null, message: '' })
    setConflictingRentals([])
  }

  if (!isOpen || !rental) return null

  const minDate = (() => {
    const currentEnd = new Date(rental.endDate)
    currentEnd.setDate(currentEnd.getDate() + 1)
    return currentEnd.toISOString().split('T')[0]
  })()

  const extensionDays = newEndDate ? Math.ceil((new Date(newEndDate).getTime() - new Date(rental.endDate).getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-gradient-to-r from-primary via-primary-dark to-primary-light text-white p-6 rounded-t-3xl'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-3xl font-bold mb-2'>Extend Rental</h2>
              <p className='text-white/90'>Rental ID: {rental.rentalId} - {rental.vehicle.name}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Current End Date Info */}
          <div className='bg-blue-50 border-2 border-blue-200 rounded-xl p-4'>
            <p className='text-sm font-semibold text-blue-700 mb-1'>Current End Date</p>
            <p className='text-lg font-bold text-blue-900'>
              {new Date(rental.endDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* New End Date */}
          <div>
            <label className='block text-sm font-semibold text-gray-300 mb-2'>
              New End Date <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              required
              min={minDate}
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none [color-scheme:light]'
            />
            {extensionDays > 0 && (
              <p className='mt-2 text-sm text-gray-300'>
                Extension: <span className='font-semibold text-primary'>{extensionDays} day{extensionDays !== 1 ? 's' : ''}</span>
              </p>
            )}
          </div>

          {/* Availability Status */}
          {availabilityStatus.message && (
            <div className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
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

          {/* Additional Cost */}
          {additionalCost > 0 && (
            <div className='bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-6'>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-300'>Vehicle rate ({extensionDays} {extensionDays !== 1 ? 'days' : 'day'})</span>
                  <span className='font-semibold text-gray-300'>{formatCurrency(rental.vehicle.price * extensionDays)}</span>
                </div>
                {rental.withDriver && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-300'>With Driver ({extensionDays} {extensionDays !== 1 ? 'days' : 'day'})</span>
                    <span className='font-semibold text-gray-300'>{formatCurrency(50 * extensionDays)}</span>
                  </div>
                )}
                {rental.insurance && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-300'>Insurance ({extensionDays} {extensionDays !== 1 ? 'days' : 'day'})</span>
                    <span className='font-semibold text-gray-300'>{formatCurrency(20 * extensionDays)}</span>
                  </div>
                )}
                <div className='pt-3 border-t-2 border-primary/20 flex justify-between items-center'>
                  <span className='text-sm font-semibold text-gray-300'>Additional Cost</span>
                  <span className='text-3xl font-bold text-primary'>{formatCurrency(additionalCost)}</span>
                </div>
                <div className='flex justify-between items-center pt-2'>
                  <span className='text-sm font-semibold text-gray-300'>New Total Amount</span>
                  <span className='text-xl font-bold text-gray-300'>{formatCurrency(rental.totalAmount + additionalCost)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : message.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <p className='font-semibold'>{message.text}</p>
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-4 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-300 font-bold hover:bg-gray-50 transition-all'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading || availabilityStatus.available === false || availabilityStatus.checking || !newEndDate || extensionDays <= 0}
              className='flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-primary via-primary-dark to-primary-light text-white font-bold hover:shadow-xl hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Processing...' : availabilityStatus.checking ? 'Checking...' : 'Confirm Extension'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RentalExtensionDialog
