'use client'
import React, { useState } from 'react'
import Layout from './Layout'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('')
  const [showPickupDropdown, setShowPickupDropdown] = useState(false)

  const locations = [
    'Casablanca City Center',
    'Casablanca Airport',
    'Marrakech',
    'Rabat',
    'Tangier',
    'Agadir',
    'Fes'
  ]

  return (
    <Layout>
      <div className='relative flex flex-col items-center justify-center min-h-[600px] text-center bg-linear-to-br from-primary via-primary-dark to-primary-light text-white rounded-2xl p-8 overflow-hidden'>
        {/* Background decoration */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl'></div>

        {/* Hero content */}
        <div className='relative z-10 mb-12'>
          <h1 className='text-5xl md:text-6xl font-bold mb-4'>Welcome to Carvo</h1>
          <p className='text-lg md:text-xl mb-8'>Your one-stop solution for all vehicle needs</p>
        </div>

        {/* Glassmorphism booking card */}
        <div className='relative z-10 w-full max-w-4xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl'>
          <h2 className='text-2xl font-bold mb-6'>Book Your Car</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Pickup Location - Custom Dropdown */}
            <div className='flex flex-col relative'>
              <label className='text-sm font-medium mb-2 text-left'>Pickup Location</label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-white/70'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <button
                  onClick={() => setShowPickupDropdown(!showPickupDropdown)}
                  className='w-full pl-11 pr-10 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white text-left focus:outline-none focus:ring-2 focus:ring-secondary transition-all'
                >
                  {pickupLocation || 'Select location'}
                </button>
                <div className='absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Custom Dropdown Menu */}
                {showPickupDropdown && (
                  <div className='absolute top-full mt-2 w-full bg-white backdrop-blur-xl rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-60 overflow-y-auto'>
                    {locations.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPickupLocation(location)
                          setShowPickupDropdown(false)
                        }}
                        className='w-full px-4 py-3 text-left text-primary hover:bg-secondary/20 hover:text-primary transition-colors flex items-center gap-3 font-medium'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pickup Date - With Calendar Icon */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-2 text-left'>Pickup Date</label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type='date'
                  className='w-full pl-11 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all [color-scheme:dark]'
                />
              </div>
            </div>

            {/* Return Date - With Calendar Icon */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-2 text-left'>Return Date</label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type='date'
                  className='w-full pl-11 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all [color-scheme:dark]'
                />
              </div>
            </div>

            {/* Search Button */}
            <div className='flex flex-col justify-end'>
              <button className='px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-secondary/50 flex items-center justify-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Additional options */}
          <div className='mt-6 flex flex-wrap gap-4 justify-center'>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <div className='relative'>
                <input type='checkbox' className='peer sr-only' />
                <div className='w-5 h-5 rounded border-2 border-white/40 bg-white/10 peer-checked:bg-secondary peer-checked:border-secondary transition-all'></div>
                <svg className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className='text-sm group-hover:text-secondary transition-colors'>With Driver</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <div className='relative'>
                <input type='checkbox' className='peer sr-only' />
                <div className='w-5 h-5 rounded border-2 border-white/40 bg-white/10 peer-checked:bg-secondary peer-checked:border-secondary transition-all'></div>
                <svg className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className='text-sm group-hover:text-secondary transition-colors'>Airport Pickup</span>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Hero
