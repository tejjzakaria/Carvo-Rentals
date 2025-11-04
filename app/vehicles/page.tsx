'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const allCars = [
    {
      id: 1,
      name: 'Mercedes-Benz S-Class',
      category: 'Luxury',
      image: '/placeholder-car.jpg',
      price: 450,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['GPS Navigation', 'Bluetooth', 'Leather Seats', 'Sunroof']
    },
    {
      id: 2,
      name: 'BMW X5',
      category: 'SUV',
      image: '/placeholder-car.jpg',
      price: 380,
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Diesel',
        year: 2024
      },
      features: ['Sunroof', 'Apple CarPlay', '4WD', 'Parking Sensors']
    },
    {
      id: 3,
      name: 'Toyota Camry',
      category: 'Sedan',
      image: '/placeholder-car.jpg',
      price: 180,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        year: 2024
      },
      features: ['Backup Camera', 'Cruise Control', 'USB Ports', 'Bluetooth']
    },
    {
      id: 4,
      name: 'Range Rover Sport',
      category: 'Luxury',
      image: '/placeholder-car.jpg',
      price: 520,
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['Premium Sound', 'Panoramic Roof', 'Massage Seats', 'Adaptive Cruise']
    },
    {
      id: 5,
      name: 'Tesla Model 3',
      category: 'Electric',
      image: '/placeholder-car.jpg',
      price: 280,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric',
        year: 2024
      },
      features: ['Autopilot', 'Premium Interior', 'Fast Charging', '15" Touchscreen']
    },
    {
      id: 6,
      name: 'Nissan Patrol',
      category: 'SUV',
      image: '/placeholder-car.jpg',
      price: 320,
      specs: {
        seats: 8,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['4x4', 'Off-Road Package', 'Third Row Seats', 'Roof Rails']
    },
    {
      id: 7,
      name: 'Audi A6',
      category: 'Luxury',
      image: '/placeholder-car.jpg',
      price: 400,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['Virtual Cockpit', 'Matrix LED', 'Bang & Olufsen', 'Adaptive Suspension']
    },
    {
      id: 8,
      name: 'Honda Accord',
      category: 'Sedan',
      image: '/placeholder-car.jpg',
      price: 160,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        year: 2024
      },
      features: ['Honda Sensing', 'Wireless Charging', 'Apple CarPlay', 'LED Headlights']
    },
    {
      id: 9,
      name: 'Porsche 911',
      category: 'Sport',
      image: '/placeholder-car.jpg',
      price: 850,
      specs: {
        seats: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['Sport Exhaust', 'Launch Control', 'Sport Chrono', 'Bose Sound']
    },
    {
      id: 10,
      name: 'Tesla Model Y',
      category: 'Electric',
      image: '/placeholder-car.jpg',
      price: 350,
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Electric',
        year: 2024
      },
      features: ['Autopilot', 'Glass Roof', 'Premium Audio', 'Supercharging']
    },
    {
      id: 11,
      name: 'Hyundai Tucson',
      category: 'SUV',
      image: '/placeholder-car.jpg',
      price: 220,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        year: 2024
      },
      features: ['SmartSense', 'Wireless CarPlay', 'Panoramic Sunroof', 'Heated Seats']
    },
    {
      id: 12,
      name: 'BMW M4',
      category: 'Sport',
      image: '/placeholder-car.jpg',
      price: 750,
      specs: {
        seats: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['M Sport Exhaust', 'Carbon Roof', 'Competition Package', 'Track Mode']
    }
  ]

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
          <div className='max-w-2xl mx-auto mb-12'>
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

          {/* Results Count */}
          <div className='mb-6'>
            <p className='text-gray-400'>
              Showing <span className='font-bold text-primary'>{startIndex + 1}-{Math.min(endIndex, filteredCars.length)}</span> of <span className='font-bold text-primary'>{filteredCars.length}</span> vehicles
            </p>
          </div>

          {/* Cars Grid */}
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

                  {/* Car Image Placeholder */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48 text-primary opacity-20 group-hover:opacity-30 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
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
                        <span className='text-5xl font-bold text-primary'>${car.price}</span>
                      </div>
                    </div>
                    <button className='px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-primary/50'>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredCars.length > itemsPerPage && (
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
          {filteredCars.length === 0 && (
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
    </div>
  )
}
