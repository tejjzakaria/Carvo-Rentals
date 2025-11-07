import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET admin profile
export async function GET(request: NextRequest) {
  try {
    // Get current logged-in user from JWT token
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch full user details from database
    const admin = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: admin
    })
  } catch (error) {
    console.error('Get admin profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin profile' },
      { status: 500 }
    )
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    // Get current logged-in user from JWT token
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, avatar } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    if (email !== currentUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists && emailExists.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        email,
        phone: phone || null,
        avatar: avatar || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Update admin profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update admin profile' },
      { status: 500 }
    )
  }
}
