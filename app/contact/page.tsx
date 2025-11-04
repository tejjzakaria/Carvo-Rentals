'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Layout from '@/components/Layout'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      details: ['+212 6 00 00 00 00', '+212 5 22 00 00 00'],
      link: 'tel:+212600000000'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      details: ['info@carvo.com', 'support@carvo.com'],
      link: 'mailto:info@carvo.com'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Head Office',
      details: ['Boulevard Mohammed V', 'Casablanca, Morocco'],
      link: '#'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Working Hours',
      details: ['Mon - Sat: 8:00 AM - 8:00 PM', 'Sunday: 9:00 AM - 6:00 PM'],
      link: '#'
    }
  ]

  const offices = [
    {
      city: 'Casablanca',
      address: 'Boulevard Mohammed V, Casablanca',
      phone: '+212 5 22 00 00 00'
    },
    {
      city: 'Marrakech',
      address: 'Avenue Mohammed VI, Marrakech',
      phone: '+212 5 24 00 00 00'
    },
    {
      city: 'Rabat',
      address: 'Avenue Allal Ben Abdellah, Rabat',
      phone: '+212 5 37 00 00 00'
    },
    {
      city: 'Tangier',
      address: 'Boulevard Pasteur, Tangier',
      phone: '+212 5 39 00 00 00'
    },
    {
      city: 'Agadir',
      address: 'Avenue Hassan II, Agadir',
      phone: '+212 5 28 00 00 00'
    },
    {
      city: 'Fes',
      address: 'Avenue des FAR, Fes',
      phone: '+212 5 35 00 00 00'
    }
  ]

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
            <h1 className='text-5xl md:text-6xl font-bold mb-6'>Get In Touch</h1>
            <p className='text-xl md:text-2xl leading-relaxed'>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className='bg-white border-2 border-primary rounded-2xl p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300'
            >
              <div className='inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-primary to-primary-light text-white rounded-xl mb-4'>
                {info.icon}
              </div>
              <h3 className='text-xl font-bold text-primary mb-2'>{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className='text-gray-300 text-sm'>
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Contact Form & Map Section */}
        <div className='py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <div className='bg-white border-2 border-primary rounded-3xl p-8 shadow-lg'>
              <h2 className='text-3xl font-bold mb-6 text-primary'>Send us a Message</h2>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Name */}
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                    placeholder='John Doe'
                  />
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>
                    Email Address *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                    placeholder='john@example.com'
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                    placeholder='+212 6 00 00 00 00'
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>
                    Subject *
                  </label>
                  <select
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  >
                    <option value=''>Select a subject</option>
                    <option value='booking'>Booking Inquiry</option>
                    <option value='support'>Customer Support</option>
                    <option value='feedback'>Feedback</option>
                    <option value='partnership'>Partnership</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>
                    Message *
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none text-[#000000] placeholder:text-gray-400'
                    placeholder='Tell us how we can help you...'
                  />
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  className='w-full px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-primary/50'
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Map / Additional Info */}
            <div className='space-y-8'>
              {/* Map Placeholder */}
              <div className='bg-white border-2 border-primary rounded-3xl p-8 shadow-lg'>
                <h2 className='text-3xl font-bold mb-6 text-primary'>Visit Us</h2>
                <div className='relative h-64 bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl overflow-hidden'>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                </div>
                <div className='mt-6 space-y-3'>
                  <div className='flex items-start gap-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className='font-semibold text-gray-700'>Head Office</p>
                      <p className='text-gray-300'>Boulevard Mohammed V, Casablanca, Morocco</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Contact Us */}
              <div className='bg-linear-to-br from-primary via-primary-dark to-primary-light rounded-3xl p-8 shadow-lg text-white'>
                <h3 className='text-2xl font-bold mb-4'>Why Contact Us?</h3>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24/7 Customer Support</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Quick Response Time</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Expert Guidance</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personalized Solutions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div className='py-16'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
              Our Locations
            </h2>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Visit any of our offices across Morocco for in-person assistance
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {offices.map((office, index) => (
              <div
                key={index}
                className='bg-white border-2 border-primary rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300'
              >
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold text-lg'>
                    {office.city.charAt(0)}
                  </div>
                  <h3 className='text-xl font-bold text-primary'>{office.city}</h3>
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-start gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className='text-gray-300'>{office.address}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${office.phone}`} className='text-gray-300 hover:text-primary transition-colors'>
                      {office.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>

      <Footer />
    </div>
  )
}
