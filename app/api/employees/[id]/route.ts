import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getCurrentUser } from '@/lib/auth'

// GET single employee
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const employee = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, employee })
  } catch (error) {
    console.error('Get employee error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

// PATCH update employee
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      email,
      password,
      role,
      phone,
      avatar
    } = body

    // Build update data
    const updateData: any = {}

    if (name) updateData.name = name
    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
      updateData.email = email
    }
    if (password) {
      // Validate password length
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }
      updateData.password = await bcrypt.hash(password, 10)
    }
    if (role) updateData.role = role
    if (phone !== undefined) updateData.phone = phone || null
    if (avatar !== undefined) updateData.avatar = avatar || null

    const employee = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ success: true, employee })
  } catch (error: any) {
    console.error('Update employee error:', error)

    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An employee with this email already exists' },
        { status: 409 }
      )
    }

    // Check if employee not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

// DELETE employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current logged-in user
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Prevent self-deletion
    if (currentUser.id === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete employee error:', error)

    // Check if employee not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
