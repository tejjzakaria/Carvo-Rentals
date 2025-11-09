/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import Layout from './Layout'

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  image?: string
  createdAt: string
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?activeOnly=true')
      const data = await res.json()
      if (data.success) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? 's' : ''} ago`
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isActive: false // New reviews need admin approval
        })
      })

      const data = await res.json()
      if (data.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Thank you for your review! It will be published after approval.'
        })
        setFormData({
          name: '',
          location: '',
          rating: 5,
          comment: ''
        })
        setTimeout(() => {
          setShowReviewForm(false)
          setSubmitMessage(null)
        }, 3000)
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Failed to submit review. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setSubmitMessage({
        type: 'error',
        text: 'Failed to submit review. Please try again.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  return (
    <Layout>
      <div className='py-16'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
            What Our Customers Say
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Real experiences from real customers who trusted us with their journey
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-lg text-gray-500'>Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-lg text-gray-500'>No testimonials available yet.</p>
          </div>
        ) : (
          /* Testimonials Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className='group relative bg-white hover:bg-primary border-2 border-primary hover:border-primary-light rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'
            >
              {/* Quote Icon */}
              <div className='absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-2.5 0-4.5 2-4.5 4.5S4 19 6.5 19c1.5 0 2.8-.8 3.5-2-.3 2.7-2.6 5-5.5 5H3v-2h1.5c2 0 3.5-1.5 3.5-3.5V16c-.6.6-1.5 1-2.5 1-2.5 0-4.5-2-4.5-4.5S4 8 6.5 8V10zm9 0c-2.5 0-4.5 2-4.5 4.5S13 19 15.5 19c1.5 0 2.8-.8 3.5-2-.3 2.7-2.6 5-5.5 5H12v-2h1.5c2 0 3.5-1.5 3.5-3.5V16c-.6.6-1.5 1-2.5 1-2.5 0-4.5-2-4.5-4.5S13 8 15.5 8V10z"/>
                </svg>
              </div>

              {/* Rating Stars */}
              <div className='flex gap-1 mb-4'>
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-accent group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className='text-[#333333] group-hover:text-[#EEEEEE] mb-6 leading-relaxed transition-colors relative z-10'>
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className='flex items-center gap-4 pt-4 border-t border-gray-200 group-hover:border-white/20 transition-colors'>
                {/* Avatar */}
                <div className='w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-light group-hover:from-white group-hover:to-white flex items-center justify-center text-white group-hover:text-primary font-bold text-lg shadow-lg transition-all'>
                  {testimonial.name.charAt(0)}
                </div>

                {/* Name and Location */}
                <div className='flex-1'>
                  <h4 className='font-bold text-[#000000] group-hover:text-[#FFFFFF] transition-colors'>
                    {testimonial.name}
                  </h4>
                  <p className='text-sm text-gray-500 group-hover:text-white/80 transition-colors'>
                    {testimonial.location}
                  </p>
                </div>

                {/* Date */}
                <div className='text-xs text-gray-400 group-hover:text-white/60 transition-colors'>
                  {formatDate(testimonial.createdAt)}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className='mt-12 text-center'>
          <p className='text-gray-400 mb-4'>Have you rented with us? Share your experience!</p>
          <button
            onClick={() => setShowReviewForm(true)}
            className='px-8 py-3 bg-white hover:bg-primary text-primary hover:text-white border-2 border-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg'
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-3xl font-bold text-primary'>Write a Review</h2>
              <button
                onClick={() => {
                  setShowReviewForm(false)
                  setSubmitMessage(null)
                }}
                className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success/Error Message */}
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-xl ${
                submitMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border-2 border-green-200'
                  : 'bg-red-100 text-red-800 border-2 border-red-200'
              }`}>
                <div className='flex items-center gap-3'>
                  {submitMessage.type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <p className='font-medium'>{submitMessage.text}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitReview} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>
                    Your Name *
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder='John Doe'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>
                    Location *
                  </label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder='City, Country'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>
                  Rating *
                </label>
                <div className='flex items-center gap-4'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className='transition-transform hover:scale-110'
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-10 w-10 ${star <= formData.rating ? 'text-accent' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                  <span className='text-lg font-semibold text-[#000000] ml-2'>
                    {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-[#000000] mb-2'>
                  Your Review *
                </label>
                <textarea
                  name='comment'
                  value={formData.comment}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder='Tell us about your experience with our service...'
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none'
                />
                <p className='text-sm text-gray-400 mt-2'>
                  {formData.comment.length} characters
                </p>
              </div>

              <div className='flex gap-4 pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowReviewForm(false)
                    setSubmitMessage(null)
                  }}
                  className='flex-1 px-6 py-3 bg-gray-100 text-white font-semibold rounded-xl hover:bg-gray-200 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Testimonials
