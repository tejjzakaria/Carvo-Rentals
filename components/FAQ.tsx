'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

const FAQ_CATEGORIES = ['All', 'General', 'Pricing', 'Insurance', 'Booking', 'Vehicles', 'Documents']

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openFaqId, setOpenFaqId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchFAQs()
  }, [selectedCategory])

  useEffect(() => {
    filterFaqs()
  }, [searchQuery, allFaqs])

  const fetchFAQs = async () => {
    try {
      const params = new URLSearchParams({ activeOnly: 'true' })
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory)
      }

      const res = await fetch(`/api/faqs?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setAllFaqs(data.faqs)
        setFaqs(data.faqs)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterFaqs = () => {
    if (!searchQuery.trim()) {
      setFaqs(allFaqs)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    )
    setFaqs(filtered)
  }

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  const getCategoryCount = (category: string) => {
    if (category === 'All') return allFaqs.length
    return allFaqs.filter(faq => faq.category === category).length
  }

  return (
    <div>
      <Header />

      <Layout>
        <div className='py-16'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-5xl md:text-6xl font-bold text-primary mb-4'>
              Frequently Asked Questions
            </h1>
            <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
              Find answers to common questions about our car rental service
            </p>
          </div>

          {/* Search Bar */}
          <div className='max-w-2xl mx-auto mb-12'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search for a question...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full text-black px-6 py-4 pl-14 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors'
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className='mb-8 flex gap-3 flex-wrap justify-center'>
            {FAQ_CATEGORIES.map((category) => {
              const count = getCategoryCount(category)
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setSearchQuery('')
                  }}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {category} ({count})
                </button>
              )
            })}
          </div>

          {/* Results Count */}
          {!loading && faqs.length > 0 && (
            <div className='mb-6'>
              <p className='text-gray-400'>
                Showing <span className='font-bold text-primary'>{faqs.length}</span> {faqs.length === 1 ? 'question' : 'questions'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* FAQ List */}
          {loading ? (
            <div className='text-center py-16'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary'></div>
              <p className='mt-4 text-lg text-gray-500'>Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className='text-center py-16'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className='text-2xl font-bold text-gray-700 mb-2'>No FAQs found</h3>
              <p className='text-gray-500 mb-6'>
                {searchQuery ? 'Try adjusting your search terms' : 'No FAQs available in this category'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all'
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className='space-y-4 max-w-4xl mx-auto'>
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className='bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary transition-all'
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className='w-full px-8 py-6 text-left flex items-start justify-between transition-colors group'
                  >
                    <div className='flex-1 pr-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <span className='px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full'>
                          {faq.category}
                        </span>
                      </div>
                      <h3 className='text-xl font-bold text-black group-hover:text-primary transition-colors'>
                        {faq.question}
                      </h3>
                    </div>
                    <div className='flex-shrink-0'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 text-primary transition-transform ${
                          openFaqId === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {openFaqId === faq.id && (
                    <div className='px-8 pb-6 pt-2 border-t border-gray-100'>
                      <p className='text-gray-300 leading-relaxed whitespace-pre-line'>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contact Section */}
          <div className='mt-16 text-center bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-12 shadow-xl'>
            <h2 className='text-3xl font-bold text-white mb-4'>Still have questions?</h2>
            <p className='text-white/90 text-lg mb-8 max-w-2xl mx-auto'>
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <a
              href='/contact'
              className='inline-block px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl'
            >
              Contact Support
            </a>
          </div>
        </div>
      </Layout>

      <Footer />
    </div>
  )
}
