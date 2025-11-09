/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// GET single document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const document = await prisma.customerDocument.findUnique({
      where: { id },
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
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      document
    })
  } catch (error) {
    console.error('Get document error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

// PATCH update document (verify, reject, regenerate token)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, rejectionReason } = body

    const document = await prisma.customerDocument.findUnique({
      where: { id }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    let updatedDocument

    switch (action) {
      case 'verify':
        updatedDocument = await prisma.customerDocument.update({
          where: { id },
          data: {
            status: 'verified',
            verifiedAt: new Date(),
            rejectionReason: null
          }
        })
        break

      case 'reject':
        if (!rejectionReason) {
          return NextResponse.json(
            { error: 'Rejection reason is required' },
            { status: 400 }
          )
        }
        updatedDocument = await prisma.customerDocument.update({
          where: { id },
          data: {
            status: 'rejected',
            rejectionReason,
            verifiedAt: null
          }
        })
        break

      case 'regenerate':
        // Generate new token
        const newToken = crypto.randomBytes(32).toString('hex')
        const newExpiry = new Date()
        newExpiry.setDate(newExpiry.getDate() + 7)

        updatedDocument = await prisma.customerDocument.update({
          where: { id },
          data: {
            uploadToken: newToken,
            tokenExpiresAt: newExpiry,
            status: 'pending',
            documentUrl: null,
            uploadedAt: null,
            rejectionReason: null
          }
        })

        const uploadLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/upload-document/${newToken}`

        return NextResponse.json({
          success: true,
          document: updatedDocument,
          uploadLink
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      document: updatedDocument
    })
  } catch (error) {
    console.error('Update document error:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

// DELETE document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.customerDocument.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete document error:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
