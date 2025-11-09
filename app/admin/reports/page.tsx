/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import AdminHeader from '@/components/AdminHeader'
import { useSettings } from '@/contexts/SettingsContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Rental {
  id: string
  totalAmount: number
  paymentStatus: string
  status: string
  startDate: string
  endDate: string
  createdAt: string
  vehicle: {
    name: string
    category: string
  }
  vehicleId: string
}

interface Vehicle {
  id: string
  status: string
  category: string
}

interface Damage {
  id: string
  status: string
  repairCost: number
}

interface Maintenance {
  id: string
  status: string
  cost: number
  scheduledDate: string
}

interface ReportsData {
  totalRevenue: number
  activeRentals: number
  availableVehicles: number
  totalCustomers: number
  pendingPayments: number
  vehiclesInMaintenance: number
  overdueRentals: number
  totalDamages: number
  rentals: Rental[]
  vehicles: Vehicle[]
  damages: Damage[]
  maintenances: Maintenance[]
}

export default function AdvancedReportsPage() {
  const router = useRouter()
  const { formatCurrency } = useSettings()
  const [dateRange, setDateRange] = useState('30days')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [reportsData, setReportsData] = useState<ReportsData | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchReportsData()
  }, [dateRange])

  const fetchReportsData = async () => {
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

        // Filter by date range
        const filteredRentals = filterByDateRange(rentals, dateRange)

        // Calculate metrics
        const totalRevenue = filteredRentals
          .filter((r: Rental) => r.paymentStatus === 'paid')
          .reduce((sum: number, r: Rental) => sum + r.totalAmount, 0)

        const activeRentals = rentals.filter((r: Rental) => r.status === 'active').length
        const availableVehicles = vehicles.filter((v: any) => v.status === 'available').length

        const pendingPayments = rentals
          .filter((r: Rental) => r.paymentStatus === 'pending' || r.paymentStatus === 'partial')
          .reduce((sum: number, r: Rental) => sum + r.totalAmount, 0)

        const vehiclesInMaintenance = vehicles.filter((v: any) => v.status === 'maintenance').length

        const now = new Date()
        const overdueRentals = rentals.filter((r: Rental) => {
          const endDate = new Date(r.endDate)
          return r.status === 'active' && endDate < now
        }).length

        const totalDamages = damages.filter((d: Damage) => d.status !== 'repaired').length

        setReportsData({
          totalRevenue,
          activeRentals,
          availableVehicles,
          totalCustomers: customers.length,
          pendingPayments,
          vehiclesInMaintenance,
          overdueRentals,
          totalDamages,
          rentals,
          vehicles,
          damages,
          maintenances
        })
      }
    } catch (error) {
      console.error('Failed to fetch reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterByDateRange = (rentals: Rental[], range: string) => {
    const now = new Date()
    let startDate = new Date()

    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7)
        break
      case '30days':
        startDate.setDate(now.getDate() - 30)
        break
      case '90days':
        startDate.setDate(now.getDate() - 90)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    return rentals.filter((r: Rental) => new Date(r.createdAt) >= startDate)
  }

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7days':
        return 'Last 7 Days'
      case '30days':
        return 'Last 30 Days'
      case '90days':
        return 'Last 90 Days'
      case 'year':
        return 'This Year'
      default:
        return 'Last 30 Days'
    }
  }

  const exportToPDF = async () => {
    if (!reportRef.current) {
      alert('Report content not found. Please refresh the page.')
      return
    }

    // Store original console.error outside try block
    const originalError = console.error

    try {
      setExporting(true)

      // Wait for charts to fully render and styles to stabilize
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Suppress console errors temporarily during capture
      console.error = (...args: any[]) => {
        const errorStr = args.join(' ')
        if (!errorStr.includes('lab') && !errorStr.includes('color function')) {
          originalError(...args)
        }
      }

      // Get all sections
      const sections = reportRef.current.querySelectorAll('.report-section')

      if (sections.length === 0) {
        throw new Error('No report sections found')
      }

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10

      // Add header with company info and date range
      pdf.setFontSize(20)
      pdf.setTextColor(0, 0, 0)
      pdf.text('CARVO - Advanced Reports & Analytics', pageWidth / 2, 15, { align: 'center' })

      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Period: ${getDateRangeLabel()}`, pageWidth / 2, 22, { align: 'center' })
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 28, { align: 'center' })

      // Draw a line separator
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, 32, pageWidth - margin, 32)

      let yPosition = 38

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement

        try {
          // Capture section as image with retry logic
          const canvas = await html2canvas(section, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: section.scrollWidth,
            windowHeight: section.scrollHeight,
            ignoreElements: (element) => {
              // Skip elements that might cause issues
              return element.classList?.contains('apexcharts-toolbar') || false
            },
            onclone: (clonedDoc) => {
              // Replace any problematic color functions in the cloned document
              const style = clonedDoc.createElement('style')
              style.textContent = `
                * {
                  color-scheme: light !important;
                }
              `
              clonedDoc.head.appendChild(style)
            }
          })

          const imgData = canvas.toDataURL('image/png')
          const imgWidth = pageWidth - (2 * margin)
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          // Check if we need a new page
          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }

          // Add image to PDF
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 5

          // Add page break after certain sections for better readability
          if (i === 1 || i === 3) { // After main stats and business metrics
            pdf.addPage()
            yPosition = margin
          }
        } catch (sectionError) {
          console.error(`Error capturing section ${i}:`, sectionError)
          // Continue with next section instead of failing completely
        }
      }

      // Restore console.error
      console.error = originalError

      // Save PDF with timestamp and date range
      const timestamp = new Date().toISOString().split('T')[0]
      const rangeLabel = dateRange.replace('days', 'd')
      pdf.save(`Carvo_Report_${rangeLabel}_${timestamp}.pdf`)

    } catch (error: any) {
      originalError('Error exporting PDF:', error)
      alert(`Failed to export report: ${error.message || 'Unknown error'}. Please try again.`)
    } finally {
      // Restore console.error
      console.error = originalError
      setExporting(false)
    }
  }

  // Calculate revenue trend data (last 30 days)
  const getRevenueChartData = () => {
    if (!reportsData) return { categories: [], data: [] }

    const last30Days = []
    const revenueByDay: { [key: string]: number } = {}

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      last30Days.push(dateStr)
      revenueByDay[dateStr] = 0
    }

    const filteredRentals = filterByDateRange(reportsData.rentals, dateRange)
    filteredRentals
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

  // Revenue by category
  const getRevenueByCategoryData = () => {
    if (!reportsData) return { categories: [], data: [] }

    const revenueByCategory: { [key: string]: number } = {}
    const filteredRentals = filterByDateRange(reportsData.rentals, dateRange)

    filteredRentals
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

  // Payment status
  const getPaymentStatusData = () => {
    if (!reportsData) return { series: [0, 0, 0], labels: ['Paid', 'Pending', 'Partial'] }

    const paid = reportsData.rentals.filter(r => r.paymentStatus === 'paid').length
    const pending = reportsData.rentals.filter(r => r.paymentStatus === 'pending').length
    const partial = reportsData.rentals.filter(r => r.paymentStatus === 'partial').length

    return {
      series: [paid, pending, partial],
      labels: ['Paid', 'Pending', 'Partial']
    }
  }

  // Fleet status
  const getFleetStatusData = () => {
    if (!reportsData) return { series: [0, 0, 0], labels: ['Available', 'Rented', 'Maintenance'] }

    const available = reportsData.vehicles.filter(v => v.status === 'available').length
    const rented = reportsData.vehicles.filter(v => v.status === 'rented').length
    const maintenance = reportsData.vehicles.filter(v => v.status === 'maintenance').length

    return {
      series: [available, rented, maintenance],
      labels: ['Available', 'Rented', 'Maintenance']
    }
  }

  // Rental status distribution
  const getRentalStatusData = () => {
    if (!reportsData) return { series: [0, 0, 0, 0], labels: ['Active', 'Pending', 'Completed', 'Cancelled'] }

    const active = reportsData.rentals.filter(r => r.status === 'active').length
    const pending = reportsData.rentals.filter(r => r.status === 'pending').length
    const completed = reportsData.rentals.filter(r => r.status === 'completed').length
    const cancelled = reportsData.rentals.filter(r => r.status === 'cancelled').length

    return {
      series: [active, pending, completed, cancelled],
      labels: ['Active', 'Pending', 'Completed', 'Cancelled']
    }
  }

  // Most popular vehicles
  const getMostPopularVehicles = () => {
    if (!reportsData) return { categories: [], data: [] }

    const filteredRentals = filterByDateRange(reportsData.rentals, dateRange)
    const vehicleRentals: { [key: string]: { name: string; count: number } } = {}

    filteredRentals.forEach((r: Rental) => {
      const vehicleId = r.vehicleId
      if (!vehicleRentals[vehicleId]) {
        vehicleRentals[vehicleId] = {
          name: r.vehicle.name,
          count: 0
        }
      }
      vehicleRentals[vehicleId].count++
    })

    const topVehicles = Object.values(vehicleRentals)
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)

    return {
      categories: topVehicles.map(v => v.name),
      data: topVehicles.map(v => v.count)
    }
  }

  // Damages and maintenance costs
  const getDamagesMaintenanceData = () => {
    if (!reportsData) return { categories: ['Damages', 'Maintenance'], data: [0, 0] }

    const totalDamageCost = reportsData.damages.reduce((sum, d) => sum + d.repairCost, 0)
    const totalMaintenanceCost = reportsData.maintenances.reduce((sum, m) => sum + m.cost, 0)

    return {
      categories: ['Damages Cost', 'Maintenance Cost'],
      data: [totalDamageCost, totalMaintenanceCost]
    }
  }

  // Average rental duration
  const getAverageRentalDuration = () => {
    if (!reportsData || reportsData.rentals.length === 0) return 0

    const filteredRentals = filterByDateRange(reportsData.rentals, dateRange)
    const totalDays = filteredRentals.reduce((sum, r) => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0)

    return filteredRentals.length > 0 ? (totalDays / filteredRentals.length).toFixed(1) : 0
  }

  // Fleet utilization rate
  const getUtilizationRate = () => {
    if (!reportsData || reportsData.vehicles.length === 0) return '0'

    const totalVehicles = reportsData.vehicles.length
    const rentedVehicles = reportsData.vehicles.filter(v => v.status === 'rented').length
    return ((rentedVehicles / totalVehicles) * 100).toFixed(1)
  }

  const revenueChartData = getRevenueChartData()
  const revenueByCategoryData = getRevenueByCategoryData()
  const paymentStatusData = getPaymentStatusData()
  const fleetStatusData = getFleetStatusData()
  const rentalStatusData = getRentalStatusData()
  const popularVehiclesData = getMostPopularVehicles()
  const damagesMaintenanceData = getDamagesMaintenanceData()

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(reportsData?.totalRevenue || 0),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Rentals',
      value: reportsData?.activeRentals.toString() || '0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-primary to-primary-dark'
    },
    {
      title: 'Available Vehicles',
      value: reportsData?.availableVehicles.toString() || '0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      bgColor: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Customers',
      value: reportsData?.totalCustomers.toLocaleString() || '0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(reportsData?.pendingPayments || 0),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'In Maintenance',
      value: reportsData?.vehiclesInMaintenance.toString() || '0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      bgColor: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Overdue Rentals',
      value: reportsData?.overdueRentals.toString() || '0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'from-red-500 to-red-600'
    },
    {
      title: 'Pending Damages',
      value: reportsData?.totalDamages.toString() || '0',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'from-pink-500 to-pink-600'
    }
  ]

  const additionalMetrics = [
    {
      title: 'Fleet Utilization',
      value: `${getUtilizationRate()}%`,
      description: 'Of fleet currently rented',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Avg Rental Duration',
      value: `${getAverageRentalDuration()} days`,
      description: 'Average rental period',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Total Damages Cost',
      value: formatCurrency(reportsData?.damages.reduce((sum, d) => sum + d.repairCost, 0) || 0),
      description: 'Total repair costs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'from-rose-500 to-rose-600'
    },
    {
      title: 'Maintenance Cost',
      value: formatCurrency(reportsData?.maintenances.reduce((sum, m) => sum + m.cost, 0) || 0),
      description: 'Total maintenance spend',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      color: 'from-violet-500 to-violet-600'
    }
  ]

  return (
    <>
      <AdminHeader
        title="Advanced Reports & Analytics"
        subtitle="Comprehensive business intelligence and insights"
        actionButton={{
          label: exporting ? 'Exporting...' : 'Export PDF',
          onClick: exportToPDF,
          icon: exporting ? (
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        }}
      />

      <main className='p-8'>
        {loading ? (
          <div className='flex items-center justify-center h-96'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <p className='text-gray-500'>Loading advanced reports...</p>
            </div>
          </div>
        ) : (
          <div ref={reportRef}>
            {/* Date Range Filter */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                  <h3 className='text-lg font-bold text-[#000000] mb-1'>Analytics Period</h3>
                  <p className='text-sm text-gray-500'>Select time range for detailed analysis</p>
                </div>
                <div className='flex gap-2'>
                  {['7days', '30days', '90days', 'year'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                        dateRange === range
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200 text-gray-500 hover:border-primary'
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

            {/* Main Stats Grid */}
            <div className='report-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
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

            {/* Additional Business Metrics */}
            <div className='report-section mb-8'>
              <h2 className='text-xl font-bold text-[#000000] mb-4'>Business Performance Metrics</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {additionalMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center text-white shadow-lg mb-4`}>
                      {metric.icon}
                    </div>
                    <h3 className='text-gray-500 text-sm font-medium mb-1'>{metric.title}</h3>
                    <p className='text-2xl font-bold text-[#000000] mb-1'>{metric.value}</p>
                    <p className='text-xs text-gray-500'>{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Analytics Section */}
            <div className='report-section mb-8'>
              <h2 className='text-xl font-bold text-[#000000] mb-4'>Financial Analytics</h2>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Revenue Trend */}
                <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-bold text-[#000000] mb-4'>Revenue Trend (Last 30 Days)</h3>
                  <Chart
                    options={{
                      chart: { id: 'revenue-trend', toolbar: { show: true } },
                      xaxis: {
                        categories: revenueChartData.categories,
                        labels: { rotate: -45, style: { fontSize: '10px' } }
                      },
                      stroke: { curve: 'smooth', width: 3 },
                      colors: ['#8B5CF6'],
                      fill: {
                        type: 'gradient',
                        gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.2 }
                      },
                      dataLabels: { enabled: false },
                      tooltip: { y: { formatter: (value: number) => formatCurrency(value) } }
                    }}
                    series={[{ name: 'Revenue', data: revenueChartData.data }]}
                    type="area"
                    height={350}
                  />
                </div>

                {/* Revenue by Category */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-bold text-[#000000] mb-4'>Revenue by Vehicle Category</h3>
                  <Chart
                    options={{
                      chart: { id: 'revenue-category', toolbar: { show: false } },
                      xaxis: { categories: revenueByCategoryData.categories },
                      plotOptions: { bar: { borderRadius: 8, distributed: true } },
                      colors: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
                      dataLabels: { enabled: false },
                      legend: { show: false },
                      tooltip: { y: { formatter: (value: number) => formatCurrency(value) } }
                    }}
                    series={[{ name: 'Revenue', data: revenueByCategoryData.data }]}
                    type="bar"
                    height={350}
                  />
                </div>

                {/* Payment Status */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-bold text-[#000000] mb-4'>Payment Status Distribution</h3>
                  <Chart
                    options={{
                      chart: { id: 'payment-status' },
                      labels: paymentStatusData.labels,
                      colors: ['#10B981', '#F59E0B', '#EF4444'],
                      legend: { position: 'bottom' },
                      dataLabels: { enabled: true }
                    }}
                    series={paymentStatusData.series}
                    type="donut"
                    height={350}
                  />
                </div>
              </div>
            </div>

            {/* Fleet & Operations */}
            <div className='report-section mb-8'>
              <h2 className='text-xl font-bold text-[#000000] mb-4'>Fleet & Operations</h2>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Fleet Status */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-bold text-[#000000] mb-4'>Fleet Status Distribution</h3>
                  <Chart
                    options={{
                      chart: { id: 'fleet-status' },
                      labels: fleetStatusData.labels,
                      colors: ['#10B981', '#8B5CF6', '#F59E0B'],
                      legend: { position: 'bottom' },
                      dataLabels: { enabled: true }
                    }}
                    series={fleetStatusData.series}
                    type="pie"
                    height={350}
                  />
                </div>

                {/* Rental Status */}
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-bold text-[#000000] mb-4'>Rental Status Breakdown</h3>
                  <Chart
                    options={{
                      chart: { id: 'rental-status' },
                      labels: rentalStatusData.labels,
                      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
                      legend: { position: 'bottom' },
                      dataLabels: { enabled: true }
                    }}
                    series={rentalStatusData.series}
                    type="donut"
                    height={350}
                  />
                </div>

                {/* Popular Vehicles */}
                <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-bold text-[#000000] mb-4'>Top 7 Most Popular Vehicles</h3>
                  <Chart
                    options={{
                      chart: { id: 'popular-vehicles', toolbar: { show: false } },
                      plotOptions: { bar: { borderRadius: 8, horizontal: true, distributed: true } },
                      colors: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6'],
                      xaxis: { categories: popularVehiclesData.categories },
                      dataLabels: {
                        enabled: true,
                        formatter: (val: number) => `${val} rentals`,
                        style: { fontSize: '12px', fontWeight: 600 }
                      },
                      legend: { show: false }
                    }}
                    series={[{ name: 'Rentals', data: popularVehiclesData.data }]}
                    type="bar"
                    height={350}
                  />
                </div>
              </div>
            </div>

            {/* Costs Analysis */}
            <div className='report-section mb-8'>
              <h2 className='text-xl font-bold text-[#000000] mb-4'>Cost Analysis</h2>
              <div className='grid grid-cols-1 gap-6'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-lg font-bold text-[#000000] mb-4'>Damages vs Maintenance Costs</h3>
                  <Chart
                    options={{
                      chart: { id: 'costs-comparison', toolbar: { show: false } },
                      xaxis: { categories: damagesMaintenanceData.categories },
                      plotOptions: { bar: { borderRadius: 8, columnWidth: '50%' } },
                      colors: ['#EF4444', '#8B5CF6'],
                      dataLabels: { enabled: false },
                      tooltip: { y: { formatter: (value: number) => formatCurrency(value) } }
                    }}
                    series={[{ name: 'Cost', data: damagesMaintenanceData.data }]}
                    type="bar"
                    height={350}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
