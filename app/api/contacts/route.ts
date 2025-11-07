import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all contact messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      contacts
    })
  } catch (error: any) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST - Create new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, email, phone, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'new'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contact
    })
  } catch (error: any) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// PATCH - Update contact status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['new', 'read', 'replied', 'archived']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      contact
    })
  } catch (error: any) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE - Delete contact message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
