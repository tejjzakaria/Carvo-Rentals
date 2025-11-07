import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all newsletter subscriptions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'all'

    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    const subscriptions = await prisma.newsletter.findMany({
      where,
      orderBy: { subscribedAt: 'desc' }
    })

    return NextResponse.json({ success: true, subscriptions })
  } catch (error) {
    console.error('Get newsletter subscriptions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

// POST create new newsletter subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source = 'footer' } = body

    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 400 }
        )
      } else {
        // Reactivate if previously unsubscribed
        const subscription = await prisma.newsletter.update({
          where: { email },
          data: {
            status: 'active',
            subscribedAt: new Date()
          }
        })
        return NextResponse.json({ success: true, subscription, message: 'Successfully resubscribed!' })
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletter.create({
      data: {
        email,
        source,
        status: 'active'
      }
    })

    return NextResponse.json({ success: true, subscription, message: 'Successfully subscribed to newsletter!' }, { status: 201 })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
