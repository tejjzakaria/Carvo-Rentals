import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

// POST - Upload check-in or check-out photos
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()

    const type = formData.get('type') as 'checkIn' | 'checkOut'
    const photos: File[] = []

    // Extract all photo files
    for (let i = 0; i < 4; i++) {
      const photo = formData.get(`photo${i}`) as File
      if (photo) {
        photos.push(photo)
      }
    }

    if (photos.length !== 4) {
      return NextResponse.json(
        { error: 'Exactly 4 photos are required' },
        { status: 400 }
      )
    }

    // Validate type
    if (!type || !['checkIn', 'checkOut'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be checkIn or checkOut' },
        { status: 400 }
      )
    }

    // Get rental to verify it exists
    const rental = await prisma.rental.findUnique({
      where: { id }
    })

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    // Upload photos to S3
    const uploadedUrls: string[] = []
    const labels = ['front', 'back', 'left', 'right']

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      const buffer = Buffer.from(await photo.arrayBuffer())
      const fileName = `rentals/${id}/${type}/${labels[i]}-${crypto.randomBytes(8).toString('hex')}.${photo.type.split('/')[1]}`

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentType: photo.type
      })

      await s3Client.send(command)

      // Construct S3 URL
      const photoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
      uploadedUrls.push(photoUrl)
    }

    // Update rental with photo URLs
    const updateData: any = {
      updatedAt: new Date()
    }

    if (type === 'checkIn') {
      updateData.checkInPhotos = uploadedUrls
      updateData.checkInDate = new Date()
    } else {
      updateData.checkOutPhotos = uploadedUrls
      updateData.checkOutDate = new Date()
    }

    const updatedRental = await prisma.rental.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      rental: updatedRental,
      photoUrls: uploadedUrls,
      message: `${type === 'checkIn' ? 'Check-in' : 'Check-out'} photos uploaded successfully`
    })
  } catch (error) {
    console.error('Upload rental photos error:', error)
    return NextResponse.json(
      { error: 'Failed to upload photos' },
      { status: 500 }
    )
  }
}
