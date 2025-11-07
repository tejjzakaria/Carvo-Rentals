'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Layout from './Layout'
import { BsPhone } from 'react-icons/bs'

const Header = () => {
    const pathname = usePathname()
    const [phone, setPhone] = useState('+1 (234) 567-8901')
    const [logo, setLogo] = useState<string | null>(null)
    const [companyName, setCompanyName] = useState('Carvo')

    useEffect(() => {
        fetchSettings()
    }, [])

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

    return (
        <Layout>
            <div className='flex items-center justify-between h-16 text-black my-5'>
                <div className='w-36'>
                    <a href="/">
                        {logo ? (
                            <img src={logo} alt={`${companyName} Logo`} className='max-h-16 object-contain' />
                        ) : (
                            <span className='text-2xl font-bold text-primary'>{companyName}</span>
                        )}
                    </a>
                </div>

                <div>
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
                <div>
                    <div className='flex items-center space-x-2'>
                        <div className='bg-primary text-white p-2 rounded-md inline-flex items-center hover:bg-primary-dark cursor-pointer'>
                           <BsPhone size={20} className='inline-block' />
                        </div>
                        <div>
                            <p className='text-sm font-light'>Call us</p>
                            <p className='font-semibold'>{phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Header
