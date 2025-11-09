/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'
import BookingDialog from '@/components/BookingDialog'

interface Vehicle {
  id: string
  name: string
  category: string
  images: string[]
  price: number
  status: string
  specs: {
    seats: number
    transmission: string
    fuel: string
    year: number
  }
  features: string[]
}

function VehiclesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState('$')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({})
  const itemsPerPage = 6

  useEffect(() => {
    // Extract filters from URL
    const filters: any = {}
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const location = searchParams.get('location')

    if (category) filters.category = category
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate
    if (location) filters.location = location

    setActiveFilters(filters)
    fetchVehicles()
    fetchSettings()
  }, [searchParams])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.success && data.data && data.data.currency) {
        setCurrency(data.data.currency)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchVehicles = async () => {
    try {
      // Build query string from search params
      const params = new URLSearchParams(searchParams.toString())

      const response = await fetch(`/api/vehicles?${params.toString()}`)
      const data = await response.json()
      if (data.success && data.vehicles) {
        // Map database fields to component structure
        const mappedVehicles = data.vehicles.map((vehicle: any) => ({
          id: vehicle.id,
          name: vehicle.name,
          category: vehicle.category,
          images: vehicle.images || [],
          price: vehicle.price,
          status: vehicle.status,
          specs: {
            seats: vehicle.seats,
            transmission: vehicle.transmission,
            fuel: vehicle.fuelType,
            year: vehicle.year
          },
          features: vehicle.features || []
        }))
        setVehicles(mappedVehicles)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(filterKey)
    router.push(`/vehicles?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push('/vehicles')
  }

  const allCars = vehicles

  // Filter cars based on search term
  const filteredCars = allCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCars = filteredCars.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <Layout>
        <div className='py-16'>
          <div className='text-center mb-12'>
            <h1 className='text-5xl md:text-6xl font-bold text-primary mb-4'>
              Our Fleet
            </h1>
            <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
              Browse our extensive collection of premium vehicles available for rent
            </p>
          </div>

          {/* Search Bar */}
          <div className='max-w-2xl mx-auto mb-8'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search for a car...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full text-black px-6 py-4 pl-14 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors hover:text-primary'
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Active Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className='max-w-4xl mx-auto mb-12'>
              <div className='bg-gray-50 rounded-2xl p-4 border border-gray-200'>
                <div className='flex flex-wrap items-center gap-3'>
                  <span className='text-sm font-semibold text-gray-700'>Active Filters:</span>

                  {activeFilters.category && (
                    <div className='inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary/30 text-primary'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span className='text-sm font-medium'>{activeFilters.category}</span>
                      <button
                        onClick={() => removeFilter('category')}
                        className='ml-1 hover:bg-primary/10 rounded-full p-0.5 transition-colors'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {activeFilters.startDate && activeFilters.endDate && (
                    <div className='inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary/30 text-primary'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className='text-sm font-medium'>
                        {new Date(activeFilters.startDate).toLocaleDateString()} - {new Date(activeFilters.endDate).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          removeFilter('startDate')
                          removeFilter('endDate')
                        }}
                        className='ml-1 hover:bg-primary/10 rounded-full p-0.5 transition-colors'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {activeFilters.location && (
                    <div className='inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary/30 text-primary'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className='text-sm font-medium'>{activeFilters.location}</span>
                      <button
                        onClick={() => removeFilter('location')}
                        className='ml-1 hover:bg-primary/10 rounded-full p-0.5 transition-colors'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={clearAllFilters}
                    className='ml-auto px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-full transition-colors'
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          {!loading && (
            <div className='mb-6'>
              <p className='text-gray-400'>
                Showing <span className='font-bold text-primary'>{startIndex + 1}-{Math.min(endIndex, filteredCars.length)}</span> of <span className='font-bold text-primary'>{filteredCars.length}</span> vehicles
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className='text-center py-16'>
              <svg className="animate-spin h-16 w-16 mx-auto text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className='text-2xl font-bold text-gray-700 mb-2'>Loading vehicles...</h3>
              <p className='text-gray-500'>Please wait while we fetch our fleet</p>
            </div>
          )}

          {/* Cars Grid */}
          {!loading && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {currentCars.map((car) => (
              <div
                key={car.id}
                className='group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary'
              >
                {/* Image Section */}
                <div className='relative h-72 bg-linear-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden'>
                  {/* Category Badge */}
                  <div className='absolute top-6 right-6 z-10 bg-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl'>
                    {car.category}
                  </div>

                  {/* Rented Badge */}
                  {car.status === 'rented' && (
                    <div className='absolute top-6 left-6 z-10 bg-red-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl'>
                      RENTED
                    </div>
                  )}

                  {/* Car Image */}
                  <div className='absolute inset-0'>
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                    ) : (
                      <div className='flex items-center justify-center h-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48 text-primary opacity-20 group-hover:opacity-30 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/10 to-transparent'></div>
                </div>

                {/* Content Section */}
                <div className='p-8'>
                  {/* Car Name */}
                  <h3 className='text-3xl font-bold text-black mb-6 group-hover:text-primary transition-colors'>
                    {car.name}
                  </h3>

                  {/* Specs */}
                  <div className='flex items-center gap-6 mb-6 pb-4 border-b border-gray-200'>
                    <div className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className='text-sm font-semibold text-primary leading-none'>{car.specs.seats} Seats</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className='text-sm font-semibold text-primary leading-none'>{car.specs.transmission}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className='text-sm font-semibold text-primary leading-none'>{car.specs.fuel}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className='text-sm font-semibold text-primary leading-none'>{car.specs.year}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className='flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-200'>
                    {car.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className='text-xs bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded-full font-medium'
                      >
                        {feature}
                      </span>
                    ))}
                    {car.features.length > 3 && (
                      <span className='text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium'>
                        +{car.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-500 font-bold uppercase tracking-wider mb-2'>Price Per Day</p>
                      <div className='flex items-baseline gap-2'>
                        <span className='text-5xl font-bold text-primary'>{currency}{car.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedVehicle(car)
                        setIsBookingDialogOpen(true)
                      }}
                      className='px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-primary/50'
                    >
                      {car.status === 'rented' ? 'Book Future Dates' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredCars.length > itemsPerPage && (
            <div className='mt-12 flex justify-center items-center gap-2'>
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className='flex gap-2'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-primary text-white shadow-lg'
                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredCars.length === 0 && (
            <div className='text-center py-16'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className='text-2xl font-bold text-gray-700 mb-2'>No vehicles found</h3>
              <p className='text-gray-500 mb-6'>Try adjusting your search term</p>
              <button
                onClick={() => setSearchTerm('')}
                className='px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all'
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </Layout>

      <Footer />

      {/* Booking Dialog */}
      <BookingDialog
        isOpen={isBookingDialogOpen}
        onClose={() => {
          setIsBookingDialogOpen(false)
          setSelectedVehicle(null)
        }}
        vehicle={selectedVehicle}
        currency={currency}
      />
    </div>
  )
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={
      <div>
        <Header />
        <Layout>
          <div className='py-16 text-center'>
            <svg className="animate-spin h-16 w-16 mx-auto text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className='text-2xl font-bold text-gray-700 mb-2'>Loading vehicles...</h3>
          </div>
        </Layout>
        <Footer />
      </div>
    }>
      <VehiclesPageContent />
    </Suspense>
  )
}
