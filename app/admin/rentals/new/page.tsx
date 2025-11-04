'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function NewRentalPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    withDriver: false,
    insurance: false,
    additionalNotes: ''
  })

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  const vehicles = [
    { id: '1', name: 'Mercedes-Benz S-Class', price: 450, category: 'Luxury' },
    { id: '2', name: 'BMW X5', price: 380, category: 'SUV' },
    { id: '3', name: 'Toyota Camry', price: 180, category: 'Sedan' },
    { id: '4', name: 'Range Rover Sport', price: 520, category: 'Luxury' },
    { id: '5', name: 'Tesla Model 3', price: 280, category: 'Electric' },
    { id: '6', name: 'Nissan Patrol', price: 320, category: 'SUV' },
    { id: '7', name: 'Audi A6', price: 400, category: 'Luxury' },
    { id: '8', name: 'Honda Accord', price: 160, category: 'Sedan' },
    { id: '9', name: 'Porsche 911', price: 850, category: 'Sport' },
    { id: '10', name: 'Tesla Model Y', price: 350, category: 'Electric' }
  ]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', { ...formData, total: calculateTotal() })
    alert('Rental created successfully!')
    router.push('/admin/rentals')
  }

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)
  const totalAmount = calculateTotal()
  const days = formData.startDate && formData.endDate
    ? Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className='flex h-screen bg-[#FFFFFF]'>
      <AdminSidebar activePage="Rentals" />

      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        <AdminHeader title="Add New Rental" subtitle="Create a new rental booking" />

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

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        name='customerName'
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                        placeholder='Enter customer name'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-[#000000] mb-2'>
                          Email Address *
                        </label>
                        <input
                          type='email'
                          name='customerEmail'
                          value={formData.customerEmail}
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
                          name='customerPhone'
                          value={formData.customerPhone}
                          onChange={handleChange}
                          required
                          className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                          placeholder='+212 6 00 00 00 00'
                        />
                      </div>
                    </div>
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
                          {vehicle.name} - ${vehicle.price}/day ({vehicle.category})
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
                          <p className='text-2xl font-bold text-primary'>${selectedVehicle.price}</p>
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
                        <p className='text-sm text-gray-300'>Professional driver service (+$50/day)</p>
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
                        <p className='text-sm text-gray-300'>Full coverage insurance (+$20/day)</p>
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
                        {selectedVehicle ? selectedVehicle.name : '-'}
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
                          {selectedVehicle && days > 0 ? `$${selectedVehicle.price * days}` : '$0'}
                        </span>
                      </div>

                      {formData.withDriver && days > 0 && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-300'>Driver service</span>
                          <span className='text-[#000000]'>${50 * days}</span>
                        </div>
                      )}

                      {formData.insurance && days > 0 && (
                        <div className='flex justify-between text-sm mb-2'>
                          <span className='text-gray-300'>Insurance</span>
                          <span className='text-[#000000]'>${20 * days}</span>
                        </div>
                      )}
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-lg font-bold text-[#000000]'>Total</span>
                        <span className='text-3xl font-bold text-primary'>${totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <button
                      type='submit'
                      className='w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                    >
                      Create Rental
                    </button>

                    <button
                      type='button'
                      onClick={() => router.push('/admin/rentals')}
                      className='w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-xl transition-all'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
