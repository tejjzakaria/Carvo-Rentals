/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET notification settings
export async function GET(request: NextRequest) {
  try {
    // Get the first (and should be only) notification settings record
    let notificationSettings = await prisma.notificationSettings.findFirst()

    // If no settings exist, create default settings
    if (!notificationSettings) {
      notificationSettings = await prisma.notificationSettings.create({
        data: {
          emailNewRental: true,
          emailRentalComplete: true,
          emailPaymentReceived: true,
          emailLowInventory: false,
          smsNewRental: false,
          smsRentalReminder: true,
          smsPaymentReceived: false,
          pushNewRental: true,
          pushRentalReminder: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: notificationSettings
    })
  } catch (error) {
    console.error('Get notification settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500 }
    )
  }
}

// PUT - Update notification settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Get existing settings
    const existingSettings = await prisma.notificationSettings.findFirst()

    let notificationSettings
    if (existingSettings) {
      // Update existing settings
      notificationSettings = await prisma.notificationSettings.update({
        where: { id: existingSettings.id },
        data: {
          emailNewRental: body.emailNewRental ?? true,
          emailRentalComplete: body.emailRentalComplete ?? true,
          emailPaymentReceived: body.emailPaymentReceived ?? true,
          emailLowInventory: body.emailLowInventory ?? false,
          smsNewRental: body.smsNewRental ?? false,
          smsRentalReminder: body.smsRentalReminder ?? true,
          smsPaymentReceived: body.smsPaymentReceived ?? false,
          pushNewRental: body.pushNewRental ?? true,
          pushRentalReminder: body.pushRentalReminder ?? true
        }
      })
    } else {
      // Create new settings
      notificationSettings = await prisma.notificationSettings.create({
        data: {
          emailNewRental: body.emailNewRental ?? true,
          emailRentalComplete: body.emailRentalComplete ?? true,
          emailPaymentReceived: body.emailPaymentReceived ?? true,
          emailLowInventory: body.emailLowInventory ?? false,
          smsNewRental: body.smsNewRental ?? false,
          smsRentalReminder: body.smsRentalReminder ?? true,
          smsPaymentReceived: body.smsPaymentReceived ?? false,
          pushNewRental: body.pushNewRental ?? true,
          pushRentalReminder: body.pushRentalReminder ?? true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: notificationSettings,
      message: 'Notification settings updated successfully'
    })
  } catch (error) {
    console.error('Update notification settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    )
  }
}
