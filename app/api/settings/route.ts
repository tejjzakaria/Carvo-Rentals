import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET settings
export async function GET(request: NextRequest) {
  try {
    // Get the first (and should be only) settings record
    let settings = await prisma.settings.findFirst()

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          companyName: 'Carvo Car Rental',
          address: '123 Boulevard Mohammed V',
          city: 'Casablanca',
          country: 'Morocco',
          phone: '+212 5 22 12 34 56',
          email: 'contact@carvo.com',
          website: 'www.carvo.com',
          taxId: 'MA123456789',
          language: 'en',
          timezone: 'Africa/Casablanca',
          currency: 'MAD',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.companyName || !body.email) {
      return NextResponse.json(
        { error: 'Company name and email are required' },
        { status: 400 }
      )
    }

    // Get existing settings
    const existingSettings = await prisma.settings.findFirst()

    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: {
          companyName: body.companyName,
          address: body.address,
          city: body.city,
          country: body.country,
          phone: body.phone,
          email: body.email,
          website: body.website || null,
          taxId: body.taxId || null,
          language: body.language || 'en',
          timezone: body.timezone || 'Africa/Casablanca',
          currency: body.currency || 'MAD',
          dateFormat: body.dateFormat || 'DD/MM/YYYY',
          timeFormat: body.timeFormat || '24h',
          googleSheetId: body.googleSheetId || null,
          logoPanelUrl: body.logoPanelUrl || null,
          logoHeaderUrl: body.logoHeaderUrl || null,
          logoFooterUrl: body.logoFooterUrl || null,
          facebookUrl: body.facebookUrl || null,
          instagramUrl: body.instagramUrl || null,
          twitterUrl: body.twitterUrl || null,
          linkedinUrl: body.linkedinUrl || null
        }
      })
    } else {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          companyName: body.companyName,
          address: body.address,
          city: body.city,
          country: body.country,
          phone: body.phone,
          email: body.email,
          website: body.website || null,
          taxId: body.taxId || null,
          language: body.language || 'en',
          timezone: body.timezone || 'Africa/Casablanca',
          currency: body.currency || 'MAD',
          dateFormat: body.dateFormat || 'DD/MM/YYYY',
          timeFormat: body.timeFormat || '24h',
          googleSheetId: body.googleSheetId || null,
          logoPanelUrl: body.logoPanelUrl || null,
          logoHeaderUrl: body.logoHeaderUrl || null,
          logoFooterUrl: body.logoFooterUrl || null,
          facebookUrl: body.facebookUrl || null,
          instagramUrl: body.instagramUrl || null,
          twitterUrl: body.twitterUrl || null,
          linkedinUrl: body.linkedinUrl || null
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
