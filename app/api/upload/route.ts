/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, S3_BUCKET_NAME, isS3Configured } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    // Check if S3 is configured
    if (!isS3Configured() || !s3Client || !S3_BUCKET_NAME) {
      return NextResponse.json(
        {
          error: 'AWS S3 is not configured. Please check your .env file and ensure all AWS credentials are set correctly.',
          details: 'Missing or invalid AWS credentials. See AWS_S3_SETUP.md for setup instructions.'
        },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const fileName = `vehicles/${timestamp}-${randomString}.${extension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to S3
    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }

    const command = new PutObjectCommand(uploadParams)
    await s3Client.send(command)

    // Construct the URL
    const fileUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}
