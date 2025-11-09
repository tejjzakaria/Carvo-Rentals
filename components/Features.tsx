/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import Layout from './Layout'
import { getIconPath } from '@/lib/icons'

interface Feature {
  id: string
  icon: string
  iconUrl?: string
  title: string
  description: string
  order: number
}

const Features = () => {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/features?activeOnly=true')
      const data = await res.json()
      if (data.success) {
        setFeatures(data.features)
      }
    } catch (error) {
      console.error('Error fetching features:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className='py-16'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
            Why Choose us?
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Experience the best car rental service with our premium features and exceptional customer support
          </p>
        </div>

        {/* Features Grid */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary'></div>
            <p className='mt-4 text-lg text-gray-500'>Loading features...</p>
          </div>
        ) : features.length === 0 ? (
          <div className='text-center py-12'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <p className='text-lg text-gray-500'>No features available</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature) => (
              <div
                key={feature.id}
                className='group relative bg-white hover:bg-primary border border-gray-200 hover:border-primary-light rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
              >
                {/* Content */}
                <div className='relative z-10'>
                  {/* Icon */}
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary to-primary-light hover:bg-white text-white rounded-xl mb-4 group-hover:scale-110 transition-all shadow-lg'>
                    {feature.icon === 'custom' && feature.iconUrl ? (
                      <img src={feature.iconUrl} alt={feature.title} className="w-8 h-8 object-contain" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(feature.icon)} />
                      </svg>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className='text-xl font-bold text-[#000000] group-hover:text-[#FFFFFF] mb-3 transition-colors'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='text-[#333333] group-hover:text-[#EEEEEE] leading-relaxed transition-colors'>
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className='absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-accent/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Features
