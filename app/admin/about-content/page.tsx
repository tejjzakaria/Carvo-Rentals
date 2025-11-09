/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'

interface ValueItem {
  icon: string
  title: string
  description: string
}

export default function AboutContentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    storyTitle: '',
    storyContent: ['', '', ''],
    storyImage: '',
    missionTitle: '',
    missionContent: '',
    visionTitle: '',
    visionContent: '',
    values: [
      { icon: 'shield', title: '', description: '' },
      { icon: 'star', title: '', description: '' },
      { icon: 'users', title: '', description: '' },
      { icon: 'bolt', title: '', description: '' }
    ] as ValueItem[],
    statsTitle: '',
    statsSubtitle: '',
    ctaTitle: '',
    ctaSubtitle: '',
    ctaButtonText: ''
  })

  useEffect(() => {
    fetchAboutContent()
  }, [])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  const fetchAboutContent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/about-content')
      const result = await response.json()

      if (result.success && result.data) {
        const data = result.data
        setFormData({
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          heroImage: data.heroImage || '',
          storyTitle: data.storyTitle || '',
          storyContent: data.storyContent || ['', '', ''],
          storyImage: data.storyImage || '',
          missionTitle: data.missionTitle || '',
          missionContent: data.missionContent || '',
          visionTitle: data.visionTitle || '',
          visionContent: data.visionContent || '',
          values: data.values?.map((v: string) => JSON.parse(v)) || [
            { icon: 'shield', title: '', description: '' },
            { icon: 'star', title: '', description: '' },
            { icon: 'users', title: '', description: '' },
            { icon: 'bolt', title: '', description: '' }
          ],
          statsTitle: data.statsTitle || '',
          statsSubtitle: data.statsSubtitle || '',
          ctaTitle: data.ctaTitle || '',
          ctaSubtitle: data.ctaSubtitle || '',
          ctaButtonText: data.ctaButtonText || ''
        })
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
      setToast({ show: true, message: 'Failed to fetch content', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Convert values array to JSON strings
      const dataToSave = {
        ...formData,
        values: formData.values.map(v => JSON.stringify(v))
      }

      const response = await fetch('/api/about-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setToast({ show: true, message: 'About content updated successfully!', type: 'success' })
      } else {
        setToast({ show: true, message: result.error || 'Failed to update content', type: 'error' })
      }
    } catch (error) {
      console.error('Error updating about content:', error)
      setToast({ show: true, message: 'Failed to update content', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const updateStoryParagraph = (index: number, value: string) => {
    const newStoryContent = [...formData.storyContent]
    newStoryContent[index] = value
    setFormData({ ...formData, storyContent: newStoryContent })
  }

  const addStoryParagraph = () => {
    setFormData({ ...formData, storyContent: [...formData.storyContent, ''] })
  }

  const removeStoryParagraph = (index: number) => {
    const newStoryContent = formData.storyContent.filter((_, i) => i !== index)
    setFormData({ ...formData, storyContent: newStoryContent })
  }

  const updateValue = (index: number, field: keyof ValueItem, value: string) => {
    const newValues = [...formData.values]
    newValues[index] = { ...newValues[index], [field]: value }
    setFormData({ ...formData, values: newValues })
  }

  const addValue = () => {
    setFormData({
      ...formData,
      values: [...formData.values, { icon: 'shield', title: '', description: '' }]
    })
  }

  const removeValue = (index: number) => {
    const newValues = formData.values.filter((_, i) => i !== index)
    setFormData({ ...formData, values: newValues })
  }

  if (loading) {
    return (
      <>
        <AdminHeader
          title="About Page Content"
          subtitle="Manage the content displayed on the About page"
        />
        <div className='flex items-center justify-center h-64'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='text-gray-600 mt-4'>Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminHeader
        title="About Page Content"
        subtitle="Manage the content displayed on the About page"
      />

      <main className='p-8'>
          {/* Hero Section */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <h2 className='text-2xl font-bold text-[#000000] mb-6'>Hero Section</h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Hero Title</label>
                <input
                  type='text'
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='About Carvo'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Hero Subtitle</label>
                <textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  rows={3}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder="Morocco's premier car rental service..."
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Hero Image URL (optional)</label>
                <input
                  type='text'
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='/images/hero.jpg'
                />
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <h2 className='text-2xl font-bold text-[#000000] mb-6'>Story Section</h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Story Title</label>
                <input
                  type='text'
                  value={formData.storyTitle}
                  onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='Our Story'
                />
              </div>

              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-semibold text-[#000000]'>Story Paragraphs</label>
                  <button
                    onClick={addStoryParagraph}
                    className='px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all'
                  >
                    + Add Paragraph
                  </button>
                </div>

                <div className='space-y-4'>
                  {formData.storyContent.map((paragraph, index) => (
                    <div key={index} className='flex gap-2'>
                      <textarea
                        value={paragraph}
                        onChange={(e) => updateStoryParagraph(index, e.target.value)}
                        rows={3}
                        className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        placeholder={`Paragraph ${index + 1}`}
                      />
                      {formData.storyContent.length > 1 && (
                        <button
                          onClick={() => removeStoryParagraph(index)}
                          className='px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all'
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Story Image URL (optional)</label>
                <input
                  type='text'
                  value={formData.storyImage}
                  onChange={(e) => setFormData({ ...formData, storyImage: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='/logos/logo-primary-bg.png'
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <h2 className='text-2xl font-bold text-[#000000] mb-6'>Mission & Vision</h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Mission Title</label>
                <input
                  type='text'
                  value={formData.missionTitle}
                  onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='Our Mission'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Mission Content</label>
                <textarea
                  value={formData.missionContent}
                  onChange={(e) => setFormData({ ...formData, missionContent: e.target.value })}
                  rows={4}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='To provide accessible, reliable, and premium car rental services...'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Vision Title</label>
                <input
                  type='text'
                  value={formData.visionTitle}
                  onChange={(e) => setFormData({ ...formData, visionTitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='Our Vision'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Vision Content</label>
                <textarea
                  value={formData.visionContent}
                  onChange={(e) => setFormData({ ...formData, visionContent: e.target.value })}
                  rows={4}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='To become the leading car rental service across North Africa...'
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-[#000000]'>Core Values</h2>
              <button
                onClick={addValue}
                className='px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all'
              >
                + Add Value
              </button>
            </div>

            <div className='space-y-6'>
              {formData.values.map((value, index) => (
                <div key={index} className='border-2 border-gray-200 rounded-xl p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-bold text-[#000000]'>Value {index + 1}</h3>
                    {formData.values.length > 1 && (
                      <button
                        onClick={() => removeValue(index)}
                        className='px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all'
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>Icon</label>
                      <select
                        value={value.icon}
                        onChange={(e) => updateValue(index, 'icon', e.target.value)}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                      >
                        <option value='shield'>Shield (Trust & Security)</option>
                        <option value='star'>Star (Excellence)</option>
                        <option value='users'>Users (Customer Focus)</option>
                        <option value='bolt'>Bolt (Innovation)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>Title</label>
                      <input
                        type='text'
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        placeholder='Trust & Reliability'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-[#000000] mb-2'>Description</label>
                      <textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        rows={3}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                        placeholder='We prioritize your safety and peace of mind...'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <h2 className='text-2xl font-bold text-[#000000] mb-2'>Stats Section</h2>
            <p className='text-gray-300 mb-6'>Stats are managed separately in the Stats page</p>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Stats Title</label>
                <input
                  type='text'
                  value={formData.statsTitle}
                  onChange={(e) => setFormData({ ...formData, statsTitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='Carvo in Numbers'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Stats Subtitle (optional)</label>
                <input
                  type='text'
                  value={formData.statsSubtitle}
                  onChange={(e) => setFormData({ ...formData, statsSubtitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder="Discover the impact we've made..."
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6'>
            <h2 className='text-2xl font-bold text-[#000000] mb-6'>Call to Action Section</h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>CTA Title</label>
                <input
                  type='text'
                  value={formData.ctaTitle}
                  onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='Ready to Start Your Journey?'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>CTA Subtitle (optional)</label>
                <input
                  type='text'
                  value={formData.ctaSubtitle}
                  onChange={(e) => setFormData({ ...formData, ctaSubtitle: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='Join thousands of satisfied customers...'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>Button Text</label>
                <input
                  type='text'
                  value={formData.ctaButtonText}
                  onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  placeholder='Browse Our Fleet'
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className='flex justify-end gap-4'>
            <button
              onClick={fetchAboutContent}
              className='px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold'
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold disabled:opacity-50'
            >
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
      </main>

      {/* Toast Notification */}
      {toast.show && (
        <div className='fixed bottom-8 right-8 z-50 animate-slide-up'>
          <div className={`px-6 py-4 rounded-xl shadow-lg border-2 ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className='flex items-center gap-3'>
              {toast.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className='font-semibold'>{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
