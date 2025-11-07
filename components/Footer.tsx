'use client'
import { useState, useEffect } from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState('Carvo')
  const [contactInfo, setContactInfo] = useState({
    email: 'info@carvo.com',
    phone: '+212 6 00 00 00 00',
    address: 'Casablanca, Morocco'
  })
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.success) {
        setLogo(data.data.logoFooterUrl || null)
        setCompanyName(data.data.companyName || 'Carvo')
        setContactInfo({
          email: data.data.email || 'info@carvo.com',
          phone: data.data.phone || '+212 6 00 00 00 00',
          address: `${data.data.city || 'Casablanca'}, ${data.data.country || 'Morocco'}`
        })
        setSocialLinks({
          facebook: data.data.facebookUrl || '#',
          instagram: data.data.instagramUrl || '#',
          twitter: data.data.twitterUrl || '#',
          linkedin: data.data.linkedinUrl || '#'
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, source: 'footer' })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Successfully subscribed!' })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' })
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Fleet', href: '/vehicles' },
    { name: 'Locations', href: '/contact' },
    { name: 'FAQs', href: '/faq' }
  ]

  const support = [
    { name: 'Terms & Conditions', href: '/pages/terms-conditions' },
    { name: 'Privacy Policy', href: '/pages/privacy-policy' },
    { name: 'Cancellation Policy', href: '/pages/cancellation-policy' }
  ]

  const contact = [
    { icon: '📧', text: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: '📞', text: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, '')}` },
    { icon: '📍', text: contactInfo.address, href: '#' }
  ]

  const socialLinksData = [
    {
      name: 'Facebook',
      href: socialLinks.facebook,
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: socialLinks.instagram,
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: socialLinks.twitter,
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: socialLinks.linkedin,
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ]

  return (
    <footer className='bg-gray-900 text-white'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='lg:col-span-1'>
            {logo ? (
              <img src={logo} alt={companyName} className="w-36 max-h-16 object-contain mb-5" />
            ) : (
              <div className='text-2xl font-bold text-primary mb-5'>{companyName}</div>
            )}
            <p className='text-gray-400 mb-6 leading-relaxed'>
              Your trusted partner for premium car rentals. Experience luxury, comfort, and reliability with every journey.
            </p>

            {/* Social Links - Only show if at least one URL is configured */}
            {socialLinksData.filter(link => link.href !== '#').length > 0 && (
              <div className='flex gap-4'>
                {socialLinksData.filter(link => link.href !== '#').map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-primary hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110'
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-bold mb-4 text-primary'>Quick Links</h4>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group'
                  >
                    <span className='w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300'></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='text-lg font-bold mb-4 text-primary'>Legal Pages</h4>
            <ul className='space-y-3'>
              {support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className='text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group'
                  >
                    <span className='w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300'></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className='text-lg font-bold mb-4 text-primary'>Get In Touch</h4>
            <ul className='space-y-3 mb-6'>
              {contact.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className='text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-3'
                  >
                    <span className='text-xl'>{item.icon}</span>
                    <span className='text-sm'>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div>
              <h5 className='font-semibold mb-3 text-primary'>Newsletter</h5>
              <p className='text-sm text-gray-400 mb-3'>Get updates on deals and offers</p>
              <form onSubmit={handleSubscribe} className='flex gap-2'>
                <input
                  type='email'
                  placeholder='Your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className='flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm text-gray-300 disabled:opacity-50'
                />
                <button
                  type='submit'
                  disabled={loading}
                  className='px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </form>
              {message && (
                <p className={`text-sm mt-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>

        
      </div>

      {/* Bottom Bar */}
      <div className='bg-gray-950 py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400'>
            <p>© {currentYear} {companyName}. All rights reserved.</p>
            <p>Made with ❤️ by tejjzakaria.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
