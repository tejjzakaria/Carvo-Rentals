/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// GET customer documents
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const documents = await prisma.customerDocument.findMany({
      where: { customerId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      documents
    })
  } catch (error) {
    console.error('Get customer documents error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST create document upload request or directly save uploaded document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { documentType, expiryDate, fileUrl, fileName } = body

    // Validate document type
    const validTypes = ['drivers_license', 'id_card', 'proof_of_address']
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Check if document already exists
    const existingDoc = await prisma.customerDocument.findFirst({
      where: {
        customerId: id,
        documentType,
        status: { in: ['pending', 'uploaded', 'verified'] }
      }
    })

    if (existingDoc) {
      return NextResponse.json(
        { error: 'Document request already exists for this type' },
        { status: 409 }
      )
    }

    // If fileUrl is provided, create document with uploaded status
    if (fileUrl) {
      // Generate a dummy token (required field but not used for direct uploads)
      const uploadToken = crypto.randomBytes(32).toString('hex')
      const tokenExpiresAt = new Date()
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7)

      const document = await prisma.customerDocument.create({
        data: {
          customerId: id,
          documentType,
          documentUrl: fileUrl,
          uploadToken,
          tokenExpiresAt,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          status: 'uploaded',
          uploadedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        document
      }, { status: 201 })
    }

    // Otherwise, generate upload token for customer to upload later
    // Generate secure upload token
    const uploadToken = crypto.randomBytes(32).toString('hex')

    // Token expires in 7 days
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7)

    // Create document record
    const document = await prisma.customerDocument.create({
      data: {
        customerId: id,
        documentType,
        uploadToken,
        tokenExpiresAt,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: 'pending'
      }
    })

    // Generate upload link
    const uploadLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/upload-document/${uploadToken}`

    return NextResponse.json({
      success: true,
      document,
      uploadLink
    }, { status: 201 })
  } catch (error) {
    console.error('Create document request error:', error)
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    )
  }
}
