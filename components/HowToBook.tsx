/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import Layout from './Layout'
import { getIconPath } from '@/lib/icons'

interface BookingStep {
  id: string
  stepNumber: string
  icon: string
  iconUrl?: string
  title: string
  description: string
  order: number
}

const HowToBook = () => {
  const [steps, setSteps] = useState<BookingStep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSteps()
  }, [])

  const fetchSteps = async () => {
    try {
      const res = await fetch('/api/booking-steps?activeOnly=true')
      const data = await res.json()
      if (data.success) {
        setSteps(data.steps)
      }
    } catch (error) {
      console.error('Error fetching booking steps:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className='py-16'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
            How to Book Your Car
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Follow these simple steps to book your perfect vehicle in minutes
          </p>
        </div>

        {/* Steps Container */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary'></div>
            <p className='mt-4 text-lg text-gray-500'>Loading booking steps...</p>
          </div>
        ) : steps.length === 0 ? (
          <div className='text-center py-12'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className='text-lg text-gray-500'>No booking steps available</p>
          </div>
        ) : (
          <div className='relative'>
            {/* Connection Line - Hidden on mobile */}
            <div className='hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto' style={{ width: 'calc(100% - 200px)', left: '100px' }}></div>

            {/* Steps Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10'>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className='group relative flex flex-col items-center text-center'
                >
                  {/* Step Number Badge */}
                  <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform z-20'>
                    {step.stepNumber}
                  </div>

                  {/* Card */}
                  <div className='w-full bg-white hover:bg-primary border-2 border-primary hover:border-primary-light rounded-2xl p-6 pt-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'>
                    {/* Icon */}
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light group-hover:from-white group-hover:to-white text-white group-hover:text-primary rounded-full mb-4 transition-all shadow-lg'>
                      {step.icon === 'custom' && step.iconUrl ? (
                        <img src={step.iconUrl} alt={step.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(step.icon)} />
                        </svg>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className='text-xl font-bold text-[#000000] group-hover:text-[#FFFFFF] mb-3 transition-colors'>
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className='text-[#333333] group-hover:text-[#EEEEEE] text-sm leading-relaxed transition-colors'>
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for desktop - Hidden on last item */}
                  {index < steps.length - 1 && (
                    <div className='hidden lg:block absolute top-20 -right-8 text-primary'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className='mt-16 text-center'>
          <a href="/vehicles"><button className='px-8 py-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl'>
            Book a car now
          </button></a>
        </div>
      </div>
    </Layout>
  )
}

export default HowToBook
