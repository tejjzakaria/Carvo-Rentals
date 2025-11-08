'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Layout from './Layout'
import { BsPhone } from 'react-icons/bs'
import { HiMenu, HiX } from 'react-icons/hi'

const Header = () => {
    const pathname = usePathname()
    const [phone, setPhone] = useState('+1 (234) 567-8901')
    const [logo, setLogo] = useState<string | null>(null)
    const [companyName, setCompanyName] = useState('Carvo')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    useEffect(() => {
        // Prevent body scroll when mobile menu is open
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [mobileMenuOpen])

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings')
            const data = await response.json()
            if (data.success) {
                if (data.data.phone) setPhone(data.data.phone)
                setLogo(data.data.logoHeaderUrl || null)
                setCompanyName(data.data.companyName || 'Carvo')
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        }
    }

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Vehicles', href: '/vehicles' },
        { name: 'FAQs', href: '/faq' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ]

    const handleNavClick = () => {
        setMobileMenuOpen(false)
    }

    return (
        <Layout>
            <div className='flex items-center justify-between h-16 text-black my-5'>
                {/* Logo */}
                <div className='w-28 sm:w-36 flex-shrink-0 z-50'>
                    <a href="/">
                        {logo ? (
                            <img src={logo} alt={`${companyName} Logo`} className='max-h-12 sm:max-h-16 object-contain' />
                        ) : (
                            <span className='text-xl sm:text-2xl font-bold text-primary'>{companyName}</span>
                        )}
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden lg:block'>
                    <nav>
                        <ul className='flex space-x-8 font-medium'>
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={`hover:text-primary transition-colors ${
                                            pathname === item.href ? 'text-primary' : ''
                                        }`}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Desktop Phone */}
                <div className='hidden md:flex items-center space-x-2 flex-shrink-0'>
                    <div className='bg-primary text-white p-2 rounded-md inline-flex items-center hover:bg-primary-dark cursor-pointer'>
                       <BsPhone size={20} className='inline-block' />
                    </div>
                    <div>
                        <p className='text-sm font-light'>Call us</p>
                        <p className='font-semibold'>{phone}</p>
                    </div>
                </div>

                {/* Mobile Phone Icon (Tablet) */}
                <a href={`tel:${phone}`} className='md:hidden lg:hidden flex items-center justify-center bg-primary text-white p-2.5 rounded-md hover:bg-primary-dark cursor-pointer z-50 mr-2'>
                    <BsPhone size={18} />
                </a>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className='lg:hidden z-50 text-black p-2 hover:bg-gray-100 rounded-lg transition-colors'
                    aria-label='Toggle menu'
                >
                    {mobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 lg:hidden ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className='flex flex-col h-full pt-24 px-6'>
                    {/* Mobile Navigation */}
                    <nav className='flex-1'>
                        <ul className='space-y-6'>
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        onClick={handleNavClick}
                                        className={`block text-lg font-medium hover:text-primary transition-colors ${
                                            pathname === item.href ? 'text-primary' : 'text-black'
                                        }`}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Phone Section */}
                    <div className='border-t border-gray-200 pt-6 pb-8'>
                        <div className='flex items-center space-x-3'>
                            <div className='bg-primary text-white p-3 rounded-md'>
                                <BsPhone size={20} />
                            </div>
                            <div>
                                <p className='text-sm font-light text-gray-600'>Call us</p>
                                <a href={`tel:${phone}`} className='font-semibold text-black hover:text-primary'>
                                    {phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Header
