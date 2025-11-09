/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST upload document (public endpoint with token)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, documentUrl } = body

    if (!token || !documentUrl) {
      return NextResponse.json(
        { error: 'Token and document URL are required' },
        { status: 400 }
      )
    }

    // Find document by token
    const document = await prisma.customerDocument.findUnique({
      where: { uploadToken: token },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Invalid or expired upload link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (new Date() > document.tokenExpiresAt) {
      await prisma.customerDocument.update({
        where: { id: document.id },
        data: { status: 'expired' }
      })

      return NextResponse.json(
        { error: 'Upload link has expired. Please contact support for a new link.' },
        { status: 410 }
      )
    }

    // Check if already uploaded
    if (document.status === 'uploaded' || document.status === 'verified') {
      return NextResponse.json(
        { error: 'Document has already been uploaded' },
        { status: 409 }
      )
    }

    // Update document with URL
    const updatedDocument = await prisma.customerDocument.update({
      where: { id: document.id },
      data: {
        documentUrl,
        status: 'uploaded',
        uploadedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: updatedDocument
    })
  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

// GET verify token (check if token is valid)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const document = await prisma.customerDocument.findUnique({
      where: { uploadToken: token },
      include: {
        customer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Invalid upload link' },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (new Date() > document.tokenExpiresAt) {
      await prisma.customerDocument.update({
        where: { id: document.id },
        data: { status: 'expired' }
      })

      return NextResponse.json(
        { error: 'Upload link has expired' },
        { status: 410 }
      )
    }

    // Check if already uploaded
    if (document.status === 'uploaded' || document.status === 'verified') {
      return NextResponse.json(
        { error: 'Document has already been uploaded' },
        { status: 409 }
      )
    }

    return NextResponse.json({
      success: true,
      document: {
        documentType: document.documentType,
        customer: document.customer,
        expiryDate: document.expiryDate
      }
    })
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    )
  }
}
