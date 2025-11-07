import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || 'admin'
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}
