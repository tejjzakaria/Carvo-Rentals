/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import Layout from './Layout'
import { getIconPath } from '@/lib/icons'

interface Stat {
  id: string
  number: string
  label: string
  icon: string
  iconUrl?: string
  color: string
  order: number
}

const FactsInNumbers = () => {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats?activeOnly=true')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative py-20 overflow-hidden'>
      {/* Background with gradient */}
      <div className='absolute inset-0 bg-linear-to-br from-primary via-primary-dark to-primary-light'></div>

      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl'></div>

      <Layout>
        <div className='relative z-10'>
          {/* Section Header */}
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Facts In Numbers
            </h2>
            <p className='text-lg text-white/80 max-w-2xl mx-auto'>
              Trusted by thousands of customers across Morocco
            </p>
          </div>

          {/* Facts Grid */}
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-lg text-white/80'>Loading stats...</p>
            </div>
          ) : stats.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-lg text-white/80'>No stats available</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className='group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:-translate-y-2'
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg ${
                      stat.color.startsWith('linear-gradient') ? '' : `bg-linear-to-br ${stat.color}`
                    }`}
                    style={stat.color.startsWith('linear-gradient') ? { background: stat.color } : {}}
                  >
                    {stat.icon === 'custom' && stat.iconUrl ? (
                      <img src={stat.iconUrl} alt="Custom icon" className="w-12 h-12 object-contain" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(stat.icon)} />
                      </svg>
                    )}
                  </div>

                  {/* Number */}
                  <h3 className='text-5xl font-bold text-white group-hover:text-primary mb-2 transition-colors'>
                    {stat.number}
                  </h3>

                  {/* Label */}
                  <p className='text-lg text-white/90 group-hover:text-primary font-medium transition-colors'>
                    {stat.label}
                  </p>

                  {/* Decorative corner */}
                  <div className='absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom decoration line */}
          <div className='mt-16 flex justify-center'>
            <div className='w-32 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent rounded-full'></div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default FactsInNumbers
