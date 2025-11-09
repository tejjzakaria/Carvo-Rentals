/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ManagerHeader from '@/components/ManagerHeader'
import { useSettings } from '@/contexts/SettingsContext'

interface Rental {
  id: string
  rentalId: string
  customerId: string
  vehicleId: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  paymentStatus: string
  customer: {
    name: string
    email: string
  }
  vehicle: {
    name: string
    category: string
  }
}

interface DashboardData {
  totalRevenue: number
  activeRentals: number
  availableVehicles: number
  totalCustomers: number
  recentRentals: Rental[]
}

export default function ManagerDashboard() {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    activeRentals: 0,
    availableVehicles: 0,
    totalCustomers: 0,
    recentRentals: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [rentalsRes, vehiclesRes, customersRes] = await Promise.all([
        fetch('/api/rentals'),
        fetch('/api/vehicles'),
        fetch('/api/customers')
      ])

      const rentalsData = await rentalsRes.json()
      const vehiclesData = await vehiclesRes.json()
      const customersData = await customersRes.json()

      if (rentalsData.success && vehiclesData.success && customersData.success) {
        const rentals = rentalsData.rentals
        const vehicles = vehiclesData.vehicles
        const customers = customersData.customers

        // Calculate total revenue from completed rentals
        const totalRevenue = rentals
          .filter((r: Rental) => r.paymentStatus === 'paid')
          .reduce((sum: number, r: Rental) => sum + r.totalAmount, 0)

        // Count active rentals
        const activeRentals = rentals.filter((r: Rental) => r.status === 'active').length

        // Count available vehicles
        const availableVehicles = vehicles.filter((v: any) => v.status === 'available').length

        // Get recent rentals (latest 5)
        const recentRentals = rentals
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setDashboardData({
          totalRevenue,
          activeRentals,
          availableVehicles,
          totalCustomers: customers.length,
          recentRentals
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardData.totalRevenue),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Rentals',
      value: dashboardData.activeRentals.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-primary to-primary-dark'
    },
    {
      title: 'Available Vehicles',
      value: dashboardData.availableVehicles.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      bgColor: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Customers',
      value: dashboardData.totalCustomers.toLocaleString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'from-orange-500 to-orange-600'
    }
  ]

  const quickActions = [
    {
      title: 'New Rental',
      description: 'Create a new rental booking',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: () => router.push('/manager/rentals/new')
    },
    {
      title: 'Add Vehicle',
      description: 'Add a new vehicle to fleet',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      action: () => router.push('/manager/vehicles/new')
    },
    {
      title: 'View Customers',
      description: 'Manage customer accounts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      action: () => router.push('/manager/customers')
    },
    {
      title: 'View Calendar',
      description: 'Check rental schedule',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      action: () => router.push('/manager/calendar')
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <ManagerHeader title="Dashboard" subtitle="Welcome back, Manager" />

      {/* Dashboard Content */}
      <main className='p-8'>
        {/* Stats Grid */}
        {loading ? (
          <div className='text-center py-16'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-500 mt-4'>Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className='text-gray-500 text-sm font-medium mb-1'>{stat.title}</h3>
                  <p className='text-3xl font-bold text-[#000000]'>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Recent Rentals */}
              <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-[#000000]'>Recent Rentals</h2>
                    <button
                      onClick={() => router.push('/manager/rentals')}
                      className='text-primary hover:text-primary-dark text-sm font-semibold transition-colors'
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>ID</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Customer</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Vehicle</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Period</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Status</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase'>Total</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {dashboardData.recentRentals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className='px-6 py-8 text-center text-gray-500'>
                            No recent rentals
                          </td>
                        </tr>
                      ) : (
                        dashboardData.recentRentals.map((rental) => (
                          <tr key={rental.id} className='cursor-pointer' onClick={() => router.push(`/manager/rentals/${rental.id}`)}>
                            <td className='px-6 py-4 text-sm font-medium text-primary'>{rental.rentalId}</td>
                            <td className='px-6 py-4 text-sm text-[#000000]'>{rental.customer.name}</td>
                            <td className='px-6 py-4 text-sm text-gray-300'>{rental.vehicle.name}</td>
                            <td className='px-6 py-4 text-sm text-gray-300'>
                              {formatDate(rental.startDate)} to {formatDate(rental.endDate)}
                            </td>
                            <td className='px-6 py-4'>
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(rental.status)}`}>
                                {rental.status}
                              </span>
                            </td>
                            <td className='px-6 py-4 text-sm font-bold text-[#000000]'>{formatCurrency(rental.totalAmount)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <h2 className='text-xl font-bold text-[#000000]'>Quick Actions</h2>
                </div>
                <div className='p-6 space-y-3'>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className='w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group'
                    >
                      <div className='w-10 h-10 bg-primary/10 group-hover:bg-primary rounded-lg flex items-center justify-center text-primary group-hover:text-white transition-all shrink-0'>
                        {action.icon}
                      </div>
                      <div className='text-left'>
                        <h3 className='font-semibold text-[#000000] group-hover:text-primary transition-colors'>
                          {action.title}
                        </h3>
                        <p className='text-xs text-gray-500'>{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}
