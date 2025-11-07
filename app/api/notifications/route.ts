import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const where = unreadOnly ? { read: false } : {}

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    const unreadCount = await prisma.notification.count({
      where: { read: false }
    })

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        read: false
      }
    })

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// PATCH - Mark all as read
export async function PATCH(request: NextRequest) {
  try {
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true }
    })

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    console.error('Mark all as read error:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}
