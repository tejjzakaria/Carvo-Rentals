/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('range') || '30days'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (dateRange) {
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

    // Fetch all rentals
    const allRentals = await prisma.rental.findMany({
      include: {
        vehicle: {
          select: {
            name: true,
            price: true
          }
        },
        customer: true
      }
    })

    // Fetch rentals in date range
    const rentalsInRange = await prisma.rental.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        vehicle: {
          select: {
            name: true,
            price: true
          }
        }
      }
    })

    // Calculate total revenue
    const totalRevenue = allRentals.reduce((sum, rental) => sum + rental.totalAmount, 0)

    // Calculate revenue in range
    const revenueInRange = rentalsInRange.reduce((sum, rental) => sum + rental.totalAmount, 0)

    // Get total rentals count
    const totalRentals = allRentals.length

    // Count rentals by status
    const rentalsByStatus = {
      active: allRentals.filter(r => r.status === 'active').length,
      pending: allRentals.filter(r => r.status === 'pending').length,
      completed: allRentals.filter(r => r.status === 'completed').length,
      cancelled: allRentals.filter(r => r.status === 'cancelled').length
    }

    // Get new customers in range
    const newCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    // Calculate average rental value
    const avgRentalValue = totalRentals > 0 ? totalRevenue / totalRentals : 0

    // Get monthly revenue for the last 12 months
    const monthlyRevenue = []
    const monthlyRentalCounts = []
    const monthNames = []

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)

      const monthRentals = allRentals.filter(rental => {
        const rentalDate = new Date(rental.createdAt)
        return rentalDate >= monthStart && rentalDate <= monthEnd
      })

      const monthRevenue = monthRentals.reduce((sum, rental) => sum + rental.totalAmount, 0)

      monthlyRevenue.push(monthRevenue)
      monthlyRentalCounts.push(monthRentals.length)
      monthNames.push(monthStart.toLocaleString('en-US', { month: 'short' }))
    }

    // Get popular vehicles (top 7 by rental count)
    const vehicleRentalCounts: { [key: string]: { name: string, count: number } } = {}

    allRentals.forEach(rental => {
      const vehicleName = rental.vehicle.name
      if (!vehicleRentalCounts[vehicleName]) {
        vehicleRentalCounts[vehicleName] = { name: vehicleName, count: 0 }
      }
      vehicleRentalCounts[vehicleName].count++
    })

    const popularVehicles = Object.values(vehicleRentalCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)

    // Get monthly customer growth for the last 12 months
    const allCustomers = await prisma.customer.findMany({
      select: {
        createdAt: true
      }
    })

    const monthlyCustomers = []

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)

      const monthCustomers = allCustomers.filter(customer => {
        const customerDate = new Date(customer.createdAt)
        return customerDate >= monthStart && customerDate <= monthEnd
      })

      monthlyCustomers.push(monthCustomers.length)
    }

    // Calculate previous period for comparison
    const previousPeriodStart = new Date(startDate)
    const periodDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    previousPeriodStart.setDate(startDate.getDate() - periodDays)

    const previousPeriodRentals = allRentals.filter(rental => {
      const rentalDate = new Date(rental.createdAt)
      return rentalDate >= previousPeriodStart && rentalDate < startDate
    })

    const previousRevenue = previousPeriodRentals.reduce((sum, rental) => sum + rental.totalAmount, 0)
    const previousRentalsCount = previousPeriodRentals.length
    const previousCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    })

    // Calculate percentage changes
    const revenueChange = previousRevenue > 0
      ? ((revenueInRange - previousRevenue) / previousRevenue * 100).toFixed(1)
      : '100.0'

    const rentalsChange = previousRentalsCount > 0
      ? ((rentalsInRange.length - previousRentalsCount) / previousRentalsCount * 100).toFixed(1)
      : '100.0'

    const customersChange = previousCustomers > 0
      ? ((newCustomers - previousCustomers) / previousCustomers * 100).toFixed(1)
      : '100.0'

    const previousAvgValue = previousRentalsCount > 0 ? previousRevenue / previousRentalsCount : 0
    const currentAvgValue = rentalsInRange.length > 0 ? revenueInRange / rentalsInRange.length : 0
    const avgValueChange = previousAvgValue > 0
      ? ((currentAvgValue - previousAvgValue) / previousAvgValue * 100).toFixed(1)
      : '100.0'

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRevenue: {
            value: totalRevenue,
            change: `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
            changeType: Number(revenueChange) >= 0 ? 'increase' : 'decrease'
          },
          totalRentals: {
            value: totalRentals,
            change: `${Number(rentalsChange) >= 0 ? '+' : ''}${rentalsChange}%`,
            changeType: Number(rentalsChange) >= 0 ? 'increase' : 'decrease'
          },
          newCustomers: {
            value: newCustomers,
            change: `${Number(customersChange) >= 0 ? '+' : ''}${customersChange}%`,
            changeType: Number(customersChange) >= 0 ? 'increase' : 'decrease'
          },
          avgRentalValue: {
            value: avgRentalValue,
            change: `${Number(avgValueChange) >= 0 ? '+' : ''}${avgValueChange}%`,
            changeType: Number(avgValueChange) >= 0 ? 'increase' : 'decrease'
          }
        },
        charts: {
          monthlyRevenue: {
            categories: monthNames,
            data: monthlyRevenue
          },
          rentalsByStatus: {
            labels: ['Active', 'Pending', 'Completed', 'Cancelled'],
            data: [
              rentalsByStatus.active,
              rentalsByStatus.pending,
              rentalsByStatus.completed,
              rentalsByStatus.cancelled
            ],
            total: totalRentals
          },
          popularVehicles: {
            categories: popularVehicles.map(v => v.name),
            data: popularVehicles.map(v => v.count)
          },
          monthlyRentals: {
            categories: monthNames,
            data: monthlyRentalCounts
          },
          customerGrowth: {
            categories: monthNames,
            data: monthlyCustomers
          }
        }
      }
    })
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports data' },
      { status: 500 }
    )
  }
}
