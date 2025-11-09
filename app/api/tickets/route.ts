/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')

    const where: any = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = category

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // Open tickets first
        { priority: 'desc' }, // High priority first
        { createdAt: 'desc' } // Newest first
      ]
    })

    // Count by status for stats
    const stats = {
      total: await prisma.ticket.count(),
      open: await prisma.ticket.count({ where: { status: 'open' } }),
      inProgress: await prisma.ticket.count({ where: { status: 'in_progress' } }),
      resolved: await prisma.ticket.count({ where: { status: 'resolved' } }),
      closed: await prisma.ticket.count({ where: { status: 'closed' } })
    }

    return NextResponse.json({
      success: true,
      tickets,
      stats
    })
  } catch (error: any) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      priority,
      reportedBy,
      reportedByEmail,
      assignedTo,
      attachments
    } = body

    // Validate required fields
    if (!title || !description || !category || !reportedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, reportedBy' },
        { status: 400 }
      )
    }

    // Generate unique ticket ID
    const lastTicket = await prisma.ticket.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    let ticketNumber = 1
    if (lastTicket && lastTicket.ticketId) {
      const lastNumber = parseInt(lastTicket.ticketId.split('-')[1])
      ticketNumber = lastNumber + 1
    }

    const ticketId = `TKT-${ticketNumber.toString().padStart(3, '0')}`

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketId,
        title,
        description,
        category,
        priority: priority || 'medium',
        status: 'open',
        reportedBy,
        reportedByEmail: reportedByEmail || null,
        assignedTo: assignedTo || null,
        attachments: attachments || []
      }
    })

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket', details: error.message },
      { status: 500 }
    )
  }
}
