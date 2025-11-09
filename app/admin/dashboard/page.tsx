/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import AdminHeader from '@/components/AdminHeader'
import { useSettings } from '@/contexts/SettingsContext'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

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
  createdAt: string
  customer: {
    name: string
    email: string
  }
  vehicle: {
    name: string
    category: string
  }
}

interface Vehicle {
  id: string
  name: string
  category: string
  status: string
  dailyRate: number
}

interface Damage {
  id: string
  status: string
  repairCost: number
}

interface Maintenance {
  id: string
  status: string
  scheduledDate: string
  cost: number
}

interface DashboardData {
  totalRevenue: number
  activeRentals: number
  availableVehicles: number
  totalCustomers: number
  pendingPayments: number
  vehiclesInMaintenance: number
  overdueRentals: number
  totalDamages: number
  recentRentals: Rental[]
  rentals: Rental[]
  vehicles: Vehicle[]
  damages: Damage[]
  maintenances: Maintenance[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    activeRentals: 0,
    availableVehicles: 0,
    totalCustomers: 0,
    pendingPayments: 0,
    vehiclesInMaintenance: 0,
    overdueRentals: 0,
    totalDamages: 0,
    recentRentals: [],
    rentals: [],
    vehicles: [],
    damages: [],
    maintenances: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [rentalsRes, vehiclesRes, customersRes, damagesRes, maintenanceRes] = await Promise.all([
        fetch('/api/rentals'),
        fetch('/api/vehicles'),
        fetch('/api/customers'),
        fetch('/api/damages'),
        fetch('/api/maintenance')
      ])

      const rentalsData = await rentalsRes.json()
      const vehiclesData = await vehiclesRes.json()
      const customersData = await customersRes.json()
      const damagesData = await damagesRes.json()
      const maintenanceData = await maintenanceRes.json()

      if (rentalsData.success && vehiclesData.success && customersData.success) {
        const rentals = rentalsData.rentals
        const vehicles = vehiclesData.vehicles
        const customers = customersData.customers
        const damages = damagesData.success ? damagesData.damages : []
        const maintenances = maintenanceData.success ? maintenanceData.maintenances : []

        // Calculate total revenue from paid rentals
        const totalRevenue = rentals
          .filter((r: Rental) => r.paymentStatus === 'paid')
          .reduce((sum: number, r: Rental) => sum + r.totalAmount, 0)

        // Count active rentals
        const activeRentals = rentals.filter((r: Rental) => r.status === 'active').length

        // Count available vehicles
        const availableVehicles = vehicles.filter((v: any) => v.status === 'available').length

        // Calculate pending payments
        const pendingPayments = rentals
          .filter((r: Rental) => r.paymentStatus === 'pending' || r.paymentStatus === 'partial')
          .reduce((sum: number, r: Rental) => sum + r.totalAmount, 0)

        // Count vehicles in maintenance
        const vehiclesInMaintenance = vehicles.filter((v: any) => v.status === 'maintenance').length

        // Count overdue rentals
        const now = new Date()
        const overdueRentals = rentals.filter((r: Rental) => {
          const endDate = new Date(r.endDate)
          return r.status === 'active' && endDate < now
        }).length

        // Count unresolved damages
        const totalDamages = damages.filter((d: Damage) => d.status !== 'repaired').length

        // Get recent rentals (latest 5)
        const recentRentals = rentals
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setDashboardData({
          totalRevenue,
          activeRentals,
          availableVehicles,
          totalCustomers: customers.length,
          pendingPayments,
          vehiclesInMaintenance,
          overdueRentals,
          totalDamages,
          recentRentals,
          rentals,
          vehicles,
          damages,
          maintenances
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

  // Calculate revenue by last 30 days
  const getRevenueChartData = () => {
    const last30Days = []
    const revenueByDay: { [key: string]: number } = {}

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      last30Days.push(dateStr)
      revenueByDay[dateStr] = 0
    }

    // Aggregate revenue by day
    dashboardData.rentals
      .filter((r: Rental) => r.paymentStatus === 'paid')
      .forEach((r: Rental) => {
        const date = new Date(r.createdAt).toISOString().split('T')[0]
        if (revenueByDay.hasOwnProperty(date)) {
          revenueByDay[date] += r.totalAmount
        }
      })

    return {
      categories: last30Days.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      data: last30Days.map(d => revenueByDay[d])
    }
  }

  // Calculate revenue by category
  const getRevenueByCategoryData = () => {
    const revenueByCategory: { [key: string]: number } = {}

    dashboardData.rentals
      .filter((r: Rental) => r.paymentStatus === 'paid')
      .forEach((r: Rental) => {
        const category = r.vehicle.category
        if (!revenueByCategory[category]) {
          revenueByCategory[category] = 0
        }
        revenueByCategory[category] += r.totalAmount
      })

    return {
      categories: Object.keys(revenueByCategory),
      data: Object.values(revenueByCategory)
    }
  }

  // Payment status overview
  const getPaymentStatusData = () => {
    const paid = dashboardData.rentals.filter(r => r.paymentStatus === 'paid').length
    const pending = dashboardData.rentals.filter(r => r.paymentStatus === 'pending').length
    const partial = dashboardData.rentals.filter(r => r.paymentStatus === 'partial').length

    return {
      series: [paid, pending, partial],
      labels: ['Paid', 'Pending', 'Partial']
    }
  }

  // Fleet status breakdown
  const getFleetStatusData = () => {
    const available = dashboardData.vehicles.filter(v => v.status === 'available').length
    const rented = dashboardData.vehicles.filter(v => v.status === 'rented').length
    const maintenance = dashboardData.vehicles.filter(v => v.status === 'maintenance').length

    return {
      series: [available, rented, maintenance],
      labels: ['Available', 'Rented', 'Maintenance']
    }
  }

  // Most popular vehicles
  const getMostPopularVehicles = () => {
    const vehicleRentals: { [key: string]: { name: string; count: number; revenue: number } } = {}

    dashboardData.rentals.forEach((r: Rental) => {
      const vehicleId = r.vehicleId
      if (!vehicleRentals[vehicleId]) {
        vehicleRentals[vehicleId] = {
          name: r.vehicle.name,
          count: 0,
          revenue: 0
        }
      }
      vehicleRentals[vehicleId].count++
      if (r.paymentStatus === 'paid') {
        vehicleRentals[vehicleId].revenue += r.totalAmount
      }
    })

    return Object.values(vehicleRentals)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // Calculate fleet utilization rate
  const getUtilizationRate = () => {
    const totalVehicles = dashboardData.vehicles.length
    const rentedVehicles = dashboardData.vehicles.filter(v => v.status === 'rented').length
    return totalVehicles > 0 ? ((rentedVehicles / totalVehicles) * 100).toFixed(1) : '0'
  }

  // Get alerts
  const getAlerts = () => {
    const alerts = []
    const now = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    // Overdue rentals
    if (dashboardData.overdueRentals > 0) {
      alerts.push({
        type: 'error',
        title: 'Overdue Rentals',
        message: `${dashboardData.overdueRentals} rental${dashboardData.overdueRentals > 1 ? 's are' : ' is'} past the return date`,
        action: () => router.push('/admin/rentals?filter=overdue')
      })
    }

    // Pending damages
    if (dashboardData.totalDamages > 0) {
      alerts.push({
        type: 'warning',
        title: 'Pending Damages',
        message: `${dashboardData.totalDamages} damage report${dashboardData.totalDamages > 1 ? 's' : ''} requiring attention`,
        action: () => router.push('/admin/damages')
      })
    }

    // Maintenance due
    const maintenanceDue = dashboardData.maintenances.filter((m: Maintenance) => {
      const scheduledDate = new Date(m.scheduledDate)
      return m.status === 'scheduled' && scheduledDate >= now && scheduledDate <= nextWeek
    }).length

    if (maintenanceDue > 0) {
      alerts.push({
        type: 'info',
        title: 'Upcoming Maintenance',
        message: `${maintenanceDue} vehicle${maintenanceDue > 1 ? 's' : ''} scheduled for maintenance in the next 7 days`,
        action: () => router.push('/admin/maintenance')
      })
    }

    // Pending payments
    if (dashboardData.pendingPayments > 0) {
      alerts.push({
        type: 'warning',
        title: 'Pending Payments',
        message: `${formatCurrency(dashboardData.pendingPayments)} in pending payments`,
        action: () => router.push('/admin/rentals?filter=pending-payment')
      })
    }

    return alerts
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
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(dashboardData.pendingPayments),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'In Maintenance',
      value: dashboardData.vehiclesInMaintenance.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      bgColor: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Overdue Rentals',
      value: dashboardData.overdueRentals.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'from-red-500 to-red-600'
    },
    {
      title: 'Pending Damages',
      value: dashboardData.totalDamages.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'from-pink-500 to-pink-600'
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
      action: () => router.push('/admin/rentals/new')
    },
    {
      title: 'Add Vehicle',
      description: 'Add a new vehicle to fleet',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      action: () => router.push('/admin/vehicles/new')
    },
    {
      title: 'View Reports',
      description: 'Access detailed analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      action: () => router.push('/admin/reports')
    },
    {
      title: 'View Calendar',
      description: 'Check rental schedule',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      action: () => router.push('/admin/calendar')
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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const revenueChartData = getRevenueChartData()
  const revenueByCategoryData = getRevenueByCategoryData()
  const paymentStatusData = getPaymentStatusData()
  const fleetStatusData = getFleetStatusData()
  const mostPopularVehicles = getMostPopularVehicles()
  const utilizationRate = getUtilizationRate()
  const alerts = getAlerts()

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Welcome back, Admin" />

      <main className='p-8'>
        {loading ? (
          <div className='text-center py-16'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            <p className='text-gray-300 mt-4'>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Alerts Section */}
            {alerts.length > 0 && (
              <div className='mb-8 space-y-3'>
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-2xl p-4 flex items-center justify-between ${getAlertColor(alert.type)}`}
                  >
                    <div className='flex items-center gap-3'>
                      {getAlertIcon(alert.type)}
                      <div>
                        <h3 className='font-bold text-sm'>{alert.title}</h3>
                        <p className='text-sm'>{alert.message}</p>
                      </div>
                    </div>
                    <button
                      onClick={alert.action}
                      className='px-4 py-2 bg-white hover:bg-gray-100 hover:text-white rounded-lg font-medium text-sm transition-colors'
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Grid */}
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

            {/* Financial Analytics */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              {/* Revenue Trend Chart */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-4'>Revenue Trend (Last 30 Days)</h2>
                <Chart
                  options={{
                    chart: {
                      id: 'revenue-trend',
                      toolbar: { show: false }
                    },
                    xaxis: {
                      categories: revenueChartData.categories,
                      labels: {
                        rotate: -45,
                        style: { fontSize: '10px' }
                      }
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 3
                    },
                    colors: ['#8B5CF6'],
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.2,
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    tooltip: {
                      y: {
                        formatter: (value: number) => formatCurrency(value)
                      }
                    }
                  }}
                  series={[{ name: 'Revenue', data: revenueChartData.data }]}
                  type="area"
                  height={300}
                />
              </div>

              {/* Payment Status */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-4'>Payment Status Overview</h2>
                <Chart
                  options={{
                    chart: {
                      id: 'payment-status'
                    },
                    labels: paymentStatusData.labels,
                    colors: ['#10B981', '#F59E0B', '#EF4444'],
                    legend: {
                      position: 'bottom'
                    },
                    dataLabels: {
                      enabled: true
                    }
                  }}
                  series={paymentStatusData.series}
                  type="donut"
                  height={300}
                />
              </div>
            </div>

            {/* Revenue by Category & Fleet Status */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              {/* Revenue by Category */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-4'>Revenue by Vehicle Category</h2>
                <Chart
                  options={{
                    chart: {
                      id: 'revenue-by-category',
                      toolbar: { show: false }
                    },
                    xaxis: {
                      categories: revenueByCategoryData.categories
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 8,
                        distributed: true
                      }
                    },
                    colors: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
                    dataLabels: {
                      enabled: false
                    },
                    legend: {
                      show: false
                    },
                    tooltip: {
                      y: {
                        formatter: (value: number) => formatCurrency(value)
                      }
                    }
                  }}
                  series={[{ name: 'Revenue', data: revenueByCategoryData.data }]}
                  type="bar"
                  height={300}
                />
              </div>

              {/* Fleet Status */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-bold text-[#000000] mb-4'>Fleet Status Distribution</h2>
                <Chart
                  options={{
                    chart: {
                      id: 'fleet-status'
                    },
                    labels: fleetStatusData.labels,
                    colors: ['#10B981', '#8B5CF6', '#F59E0B'],
                    legend: {
                      position: 'bottom'
                    },
                    dataLabels: {
                      enabled: true
                    }
                  }}
                  series={fleetStatusData.series}
                  type="pie"
                  height={300}
                />
              </div>
            </div>

            {/* Fleet Performance Metrics */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
              {/* Utilization Rate */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-lg font-bold text-[#000000] mb-4'>Fleet Utilization</h2>
                <div className='flex items-center justify-center h-40'>
                  <div className='text-center'>
                    <p className='text-6xl font-bold text-primary'>{utilizationRate}%</p>
                    <p className='text-gray-500 mt-2'>Of fleet currently rented</p>
                  </div>
                </div>
              </div>

              {/* Most Popular Vehicles */}
              <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-lg font-bold text-[#000000] mb-4'>Top 5 Most Popular Vehicles</h2>
                <div className='space-y-3'>
                  {mostPopularVehicles.map((vehicle, index) => (
                    <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                          {index + 1}
                        </div>
                        <div>
                          <p className='font-semibold text-white'>{vehicle.name}</p>
                          <p className='text-xs text-gray-500'>{vehicle.count} rentals</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-bold text-primary'>{formatCurrency(vehicle.revenue)}</p>
                        <p className='text-xs text-gray-500'>Total revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Recent Rentals */}
              <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-bold text-[#000000]'>Recent Rentals</h2>
                    <button
                      onClick={() => router.push('/admin/rentals')}
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
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>ID</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Customer</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Vehicle</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Period</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Status</th>
                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase'>Total</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                      {dashboardData.recentRentals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className='px-6 py-8 text-center text-gray-300'>
                            No recent rentals
                          </td>
                        </tr>
                      ) : (
                        dashboardData.recentRentals.map((rental) => (
                          <tr key={rental.id}>
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
