'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function ReportsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState('30days')

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  // Revenue Area Chart
  const revenueChartOptions: any = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#5937E0'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${value.toLocaleString()}`,
        style: {
          colors: '#9ca3af'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb'
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    }
  }

  const revenueChartSeries = [
    {
      name: 'Revenue',
      data: [12000, 15000, 18000, 22000, 25000, 28000, 26000, 30000, 32000, 35000, 38000, 40000]
    }
  ]

  // Rentals Status Donut Chart
  const rentalStatusOptions: any = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
    labels: ['Active', 'Pending', 'Completed', 'Cancelled'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#9ca3af'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontWeight: 600
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '18px',
              color: '#000000'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#000000'
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              color: '#9ca3af',
              formatter: () => '156'
            }
          }
        }
      }
    }
  }

  const rentalStatusSeries = [45, 23, 78, 10]

  // Popular Vehicles Bar Chart
  const popularVehiclesOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: ['#5937E0', '#6b46e5', '#7c55ea', '#8e64ef', '#a073f4', '#b182f9', '#c391fe'],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#000000'],
        fontSize: '12px',
        fontWeight: 600
      },
      formatter: (val: number) => `${val} rentals`,
      offsetX: 0
    },
    xaxis: {
      categories: ['Mercedes S-Class', 'BMW X5', 'Range Rover', 'Tesla Model 3', 'Audi A6', 'Toyota Camry', 'Nissan Patrol'],
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb'
    },
    legend: {
      show: false
    }
  }

  const popularVehiclesSeries = [
    {
      name: 'Rentals',
      data: [42, 38, 35, 32, 28, 25, 22]
    }
  ]

  // Monthly Rentals Column Chart
  const monthlyRentalsOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%'
      }
    },
    colors: ['#5937E0', '#10b981'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Rentals',
        style: {
          color: '#9ca3af'
        }
      },
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb'
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      labels: {
        colors: '#9ca3af'
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} rentals`
      }
    }
  }

  const monthlyRentalsSeries = [
    {
      name: '2024',
      data: [32, 35, 40, 45, 50, 55, 52, 58, 60, 65, 68, 70]
    },
    {
      name: '2023',
      data: [28, 30, 35, 38, 42, 45, 43, 48, 50, 52, 55, 58]
    }
  ]

  // Customer Growth Area Chart
  const customerGrowthOptions: any = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#10b981'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value: number) => Math.floor(value).toString(),
        style: {
          colors: '#9ca3af'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb'
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} customers`
      }
    }
  }

  const customerGrowthSeries = [
    {
      name: 'New Customers',
      data: [5, 8, 12, 15, 18, 22, 20, 25, 28, 32, 35, 40]
    }
  ]

  const stats = [
    {
      title: 'Total Revenue',
      value: '$342,500',
      change: '+12.5%',
      changeType: 'increase',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Rentals',
      value: '156',
      change: '+8.2%',
      changeType: 'increase',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-primary to-primary-dark'
    },
    {
      title: 'New Customers',
      value: '40',
      change: '+15.3%',
      changeType: 'increase',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Avg. Rental Value',
      value: '$2,195',
      change: '+5.1%',
      changeType: 'increase',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className='flex h-screen bg-[#FFFFFF]'>
      <AdminSidebar activePage="Reports" />

      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        <AdminHeader
          title="Reports & Analytics"
          subtitle="View detailed insights and statistics"
          actionButton={{
            label: 'Export Report',
            onClick: () => console.log('Export report'),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )
          }}
        />

        <main className='p-8'>
          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className='text-gray-500 text-sm font-medium mb-1'>{stat.title}</h3>
                <p className='text-3xl font-bold text-[#000000]'>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Date Range Filter */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div>
                <h3 className='text-lg font-bold text-[#000000] mb-1'>Analytics Dashboard</h3>
                <p className='text-sm text-gray-300'>View detailed charts and statistics</p>
              </div>
              <div className='flex gap-2'>
                {['7days', '30days', '90days', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      dateRange === range
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                    }`}
                  >
                    {range === '7days' && 'Last 7 Days'}
                    {range === '30days' && 'Last 30 Days'}
                    {range === '90days' && 'Last 90 Days'}
                    {range === 'year' && 'This Year'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Revenue Chart */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:col-span-2'>
              <h3 className='text-lg font-bold text-[#000000] mb-4'>Revenue Overview</h3>
              <Chart
                options={revenueChartOptions}
                series={revenueChartSeries}
                type="area"
                height={350}
              />
            </div>

            {/* Rentals Status */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-bold text-[#000000] mb-4'>Rentals by Status</h3>
              <Chart
                options={rentalStatusOptions}
                series={rentalStatusSeries}
                type="donut"
                height={350}
              />
            </div>

            {/* Customer Growth */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-bold text-[#000000] mb-4'>Customer Growth</h3>
              <Chart
                options={customerGrowthOptions}
                series={customerGrowthSeries}
                type="area"
                height={350}
              />
            </div>

            {/* Popular Vehicles */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:col-span-2'>
              <h3 className='text-lg font-bold text-[#000000] mb-4'>Most Popular Vehicles</h3>
              <Chart
                options={popularVehiclesOptions}
                series={popularVehiclesSeries}
                type="bar"
                height={350}
              />
            </div>

            {/* Monthly Rentals Comparison */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:col-span-2'>
              <h3 className='text-lg font-bold text-[#000000] mb-4'>Monthly Rentals Comparison</h3>
              <Chart
                options={monthlyRentalsOptions}
                series={monthlyRentalsSeries}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
