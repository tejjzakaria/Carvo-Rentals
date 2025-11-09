/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ticket = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      ticket
    })
  } catch (error: any) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      title,
      description,
      category,
      priority,
      status,
      assignedTo,
      resolution,
      attachments
    } = body

    // Prepare update data
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) {
      updateData.status = status
      // Set timestamps based on status
      if (status === 'resolved' && !updateData.resolvedAt) {
        updateData.resolvedAt = new Date()
      }
      if (status === 'closed' && !updateData.closedAt) {
        updateData.closedAt = new Date()
      }
    }
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (resolution !== undefined) updateData.resolution = resolution
    if (attachments !== undefined) updateData.attachments = attachments

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.ticket.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json(
      { error: 'Failed to delete ticket', details: error.message },
      { status: 500 }
    )
  }
}
