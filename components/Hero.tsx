/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Select from 'react-select'
import Layout from './Layout'

const Hero = () => {
  const router = useRouter()
  const [rentalLocation, setRentalLocation] = useState<{value: string, label: string} | null>(null)
  const [returnLocation, setReturnLocation] = useState<{value: string, label: string} | null>(null)
  const [rentalDate, setRentalDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [carType, setCarType] = useState<{value: string, label: string} | null>(null)
  const [locationOptions, setLocationOptions] = useState<{value: string, label: string}[]>([])

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations?activeOnly=true')
      const data = await res.json()
      if (data.success) {
        const options = data.locations.map((loc: any) => ({
          value: loc.name,
          label: loc.name
        }))
        setLocationOptions(options)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const carTypeOptions = [
    { value: 'All Types', label: 'All Types' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Sport', label: 'Sport' }
  ]

  // Custom styles for react-select to match glassmorphism theme
  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderColor: state.isFocused ? 'rgba(255, 107, 53, 1)' : 'rgba(255, 255, 255, 0.3)',
      borderRadius: '0.5rem',
      padding: '0.15rem',
      minHeight: '44px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 107, 53, 0.5)' : 'none',
      cursor: 'pointer',
      textAlign: 'left',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.5)'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      backdropFilter: 'blur(20px)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'rgba(26, 35, 50, 0.2)'
        : state.isFocused
        ? 'rgba(26, 35, 50, 0.1)'
        : 'white',
      color: '#1a2332',
      cursor: 'pointer',
      padding: '10px 14px',
      textAlign: 'left',
      '&:active': {
        backgroundColor: 'rgba(26, 35, 50, 0.3)'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white',
      textAlign: 'left'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.6)',
      textAlign: 'left'
    }),
    input: (base: any) => ({
      ...base,
      color: 'white',
      textAlign: 'left'
    }),
    valueContainer: (base: any) => ({
      ...base,
      textAlign: 'left',
      padding: '2px 8px'
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.7)',
      padding: '6px',
      '&:hover': {
        color: 'white'
      }
    }),
    clearIndicator: (base: any) => ({
      ...base,
      padding: '6px'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!rentalDate || !returnDate) {
      alert('Please select rental and return dates')
      return
    }

    // Build query string
    const params = new URLSearchParams()
    if (rentalDate) params.append('startDate', rentalDate)
    if (returnDate) params.append('endDate', returnDate)
    if (rentalLocation) params.append('location', rentalLocation.value)
    if (carType && carType.value !== 'All Types') params.append('category', carType.value)

    // Navigate to vehicles page with search params
    router.push(`/vehicles?${params.toString()}`)
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className='overflow-x-hidden'>
      <Layout>
        <div className='relative flex flex-col items-center justify-center min-h-[600px] text-center bg-linear-to-br from-primary via-primary-dark to-primary-light text-white rounded-2xl p-4 sm:p-8'>
        {/* Background decoration */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10'></div>

        {/* Hero content */}
        <div className='relative z-10 mb-8 sm:mb-12'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-4'>Luxury, Comfort, and Class.</h1>
          <p className='text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-center mx-auto max-w-3xl px-4'>
            Enjoy total freedom on the road with effortless car rentals tailored to your needs. Whether you're traveling for work, adventure, or everyday errands, we make getting behind the wheel simple, transparent, and stress-free.
          </p>
        </div>

        {/* Glassmorphism booking card */}
        <form onSubmit={handleSearch} className='relative z-20 w-full max-w-5xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl'>

          {/* First Row - 3 inputs */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3'>
            {/* Rental Location */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-2 text-left'>Rental Location</label>
              <Select
                instanceId="rental-location"
                value={rentalLocation}
                onChange={setRentalLocation}
                options={locationOptions}
                styles={customSelectStyles}
                placeholder="Select location"
                isClearable
                isSearchable
              />
            </div>

            {/* Return Location */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-2 text-left'>Return Location</label>
              <Select
                instanceId="return-location"
                value={returnLocation}
                onChange={setReturnLocation}
                options={locationOptions}
                styles={customSelectStyles}
                placeholder="Select location"
                isClearable
                isSearchable
              />
            </div>

            {/* Rental Date - With Calendar Icon */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-2 text-left'>
                Rental Date <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none z-10'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type='date'
                  value={rentalDate}
                  onChange={(e) => setRentalDate(e.target.value)}
                  min={today}
                  required
                  className='w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all [color-scheme:dark] box-border max-w-full'
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Second Row - 2 inputs + search button */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {/* Return Date - With Calendar Icon */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-2 text-left'>
                Return Date <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none z-10'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type='date'
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={rentalDate || today}
                  required
                  className='w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all [color-scheme:dark] box-border max-w-full'
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                />
              </div>
            </div>

            {/* Car Type */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-2 text-left'>Car Type</label>
              <Select
                instanceId="car-type"
                value={carType}
                onChange={setCarType}
                options={carTypeOptions}
                styles={customSelectStyles}
                placeholder="All Types"
                isClearable
                isSearchable
              />
            </div>

            {/* Search Button */}
            <div className='flex flex-col justify-end'>
              <button type='submit' className='w-full px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-secondary/50 flex items-center justify-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Vehicles
              </button>
            </div>
          </div>
        </form>
        </div>
      </Layout>
    </div>
  )
}

export default Hero
