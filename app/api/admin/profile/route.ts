/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET admin profile
export async function GET(request: NextRequest) {
  try {
    // Get current logged-in user from NextAuth session
    const session = await auth()

    console.log('Current user from session:', session?.user?.id, session?.user?.email)

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch full user details from database
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
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
        { success: false, error: 'User not found' },
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
      { success: false, error: 'Failed to fetch admin profile' },
      { status: 500 }
    )
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    // Get current logged-in user from NextAuth session
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, avatar } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists && emailExists.id !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Email is already in use' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
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
      { success: false, error: 'Failed to update admin profile' },
      { status: 500 }
    )
  }
}
