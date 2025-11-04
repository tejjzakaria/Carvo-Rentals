'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  const stats = [
    {
      title: 'Total Revenue',
      value: '$125,430',
      change: '+12.5%',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Rentals',
      value: '34',
      change: '+8.2%',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-primary to-primary-dark'
    },
    {
      title: 'Available Vehicles',
      value: '128',
      change: '-3.1%',
      trend: 'down',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      bgColor: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Customers',
      value: '1,248',
      change: '+18.4%',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'from-orange-500 to-orange-600'
    }
  ]

  const recentRentals = [
    {
      id: 'RNT-001',
      customer: 'Ahmed Hassan',
      vehicle: 'Mercedes-Benz S-Class',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'active',
      total: '$2,250'
    },
    {
      id: 'RNT-002',
      customer: 'Sarah Johnson',
      vehicle: 'BMW X5',
      startDate: '2024-01-16',
      endDate: '2024-01-18',
      status: 'active',
      total: '$760'
    },
    {
      id: 'RNT-003',
      customer: 'Mohammed Alami',
      vehicle: 'Toyota Camry',
      startDate: '2024-01-14',
      endDate: '2024-01-21',
      status: 'completed',
      total: '$1,260'
    },
    {
      id: 'RNT-004',
      customer: 'Emily Chen',
      vehicle: 'Tesla Model 3',
      startDate: '2024-01-17',
      endDate: '2024-01-19',
      status: 'pending',
      total: '$560'
    },
    {
      id: 'RNT-005',
      customer: 'Khalid Mansour',
      vehicle: 'Range Rover Sport',
      startDate: '2024-01-13',
      endDate: '2024-01-20',
      status: 'active',
      total: '$3,640'
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
      action: () => console.log('New Rental')
    },
    {
      title: 'Add Vehicle',
      description: 'Add a new vehicle to fleet',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      action: () => console.log('Add Vehicle')
    },
    {
      title: 'Register Customer',
      description: 'Add a new customer',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      action: () => console.log('Register Customer')
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: () => console.log('View Reports')
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
    <div className='flex h-screen bg-[#FFFFFF]'>
      {/* Sidebar */}
      <AdminSidebar activePage="Dashboard" />

      {/* Main Content */}
      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        {/* Top Bar */}
        <AdminHeader title="Dashboard" subtitle="Welcome back, Admin" />

        {/* Dashboard Content */}
        <main className='p-8'>
          {/* Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className={`w-14 h-14 bg-linear-to-br ${stat.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
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
                  <button className='text-primary hover:text-primary-dark text-sm font-semibold transition-colors'>
                    View All
                  </button>
                </div>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>ID</th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Customer</th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Vehicle</th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Period</th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Status</th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Total</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {recentRentals.map((rental) => (
                      <tr key={rental.id}>
                        <td className='px-6 py-4 text-sm font-medium text-primary'>{rental.id}</td>
                        <td className='px-6 py-4 text-sm text-[#000000]'>{rental.customer}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>{rental.vehicle}</td>
                        <td className='px-6 py-4 text-sm text-gray-300'>
                          {rental.startDate} to {rental.endDate}
                        </td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(rental.status)}`}>
                            {rental.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm font-bold text-[#000000]'>{rental.total}</td>
                      </tr>
                    ))}
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
        </main>
      </div>
    </div>
  )
}
