/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'

interface AboutData {
  heroTitle: string
  heroSubtitle: string
  heroImage?: string
  storyTitle: string
  storyContent: string[]
  storyImage?: string
  missionTitle: string
  missionContent: string
  visionTitle: string
  visionContent: string
  values: string[]
  statsTitle: string
  statsSubtitle?: string
  ctaTitle: string
  ctaSubtitle?: string
  ctaButtonText: string
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutData()
    fetchStats()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about-content')
      const data = await response.json()
      if (data.success) {
        setAboutData(data.data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats?activeOnly=true')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      shield: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      star: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      users: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bolt: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
    return icons[iconName] || icons.star
  }

  if (loading) {
    return (
      <div>
        <Header />
        <Layout>
          <div className='py-20 text-center'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-600 mt-4'>Loading...</p>
          </div>
        </Layout>
        <Footer />
      </div>
    )
  }

  if (!aboutData) return null

  const values = aboutData.values.map(v => JSON.parse(v))

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <Layout>
        <div className='relative py-20 text-center bg-linear-to-br from-primary via-primary-dark to-primary-light text-white rounded-3xl overflow-hidden mb-16'>
          {/* Background decoration */}
          <div className='absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl'></div>

          <div className='relative z-10 max-w-4xl mx-auto px-6'>
            <h1 className='text-5xl md:text-6xl font-bold mb-6'>{aboutData.heroTitle}</h1>
            <p className='text-xl md:text-2xl leading-relaxed'>
              {aboutData.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className='py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left: Image placeholder */}
            <div className='relative h-96 rounded-3xl overflow-hidden shadow-2xl'>
              <img src={aboutData.storyImage || '/logos/logo-primary-bg.png'} alt="Carvo Story" className='w-full h-full object-cover' />
            </div>

            {/* Right: Content */}
            <div>
              <h2 className='text-4xl md:text-5xl font-bold mb-6 text-primary'>{aboutData.storyTitle}</h2>
              <div className='space-y-4 text-gray-300 leading-relaxed text-lg'>
                {aboutData.storyContent.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Mission */}
            <div className='bg-white border-2 border-primary rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
              <div className='w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mb-6 shadow-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className='text-3xl font-bold mb-4 text-primary'>{aboutData.missionTitle}</h3>
              <p className='text-gray-300 leading-relaxed'>
                {aboutData.missionContent}
              </p>
            </div>

            {/* Vision */}
            <div className='bg-white border-2 border-primary rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
              <div className='w-16 h-16 bg-linear-to-br from-secondary to-secondary-light rounded-2xl flex items-center justify-center mb-6 shadow-lg'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className='text-3xl font-bold mb-4 text-primary'>{aboutData.visionTitle}</h3>
              <p className='text-gray-300 leading-relaxed'>
                {aboutData.visionContent}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}

        <div className='py-16'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
              {aboutData.statsTitle}
            </h2>
            {aboutData.statsSubtitle && (
              <p className='text-lg text-gray-300 mb-8 max-w-2xl mx-auto'>
                {aboutData.statsSubtitle}
              </p>
            )}
          </div>
          <div className='bg-linear-to-br from-primary via-primary-dark to-primary-light rounded-3xl p-12 shadow-2xl'>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              {stats.map((stat, index) => (
                <div key={index} className='text-center'>
                  <div className='text-4xl md:text-5xl font-bold text-white mb-2'>
                    {stat.number}
                  </div>
                  <div className='text-white/80 font-medium'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className='py-16'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
              Our Core Values
            </h2>
            <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
              The principles that guide everything we do at Carvo
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map((value, index) => (
              <div
                key={index}
                className='group bg-white hover:bg-primary border-2 border-primary rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1'
              >
                <div className='inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary to-primary-light group-hover:from-white group-hover:to-white text-white group-hover:text-primary rounded-xl mb-4 group-hover:scale-110 transition-all shadow-lg'>
                  {getIconComponent(value.icon)}
                </div>
                <h3 className='text-xl font-bold text-[#000000] group-hover:text-[#FFFFFF] mb-3 transition-colors'>
                  {value.title}
                </h3>
                <p className='text-[#333333] group-hover:text-[#EEEEEE] leading-relaxed transition-colors'>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className='py-16'>
          <div className='bg-white border-2 border-primary rounded-3xl p-12 text-center shadow-lg'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-primary'>
              {aboutData.ctaTitle}
            </h2>
            {aboutData.ctaSubtitle && (
              <p className='text-lg text-gray-300 mb-8 max-w-2xl mx-auto'>
                {aboutData.ctaSubtitle}
              </p>
            )}
            <a href="/vehicles">
              <button className='px-10 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-primary/50'>
                {aboutData.ctaButtonText}
              </button>
            </a>
          </div>
        </div>
      </Layout>

      <Footer />
    </div>
  )
}
