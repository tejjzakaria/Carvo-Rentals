import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET About content
export async function GET(request: NextRequest) {
  try {
    // Get the first (and should be only) about content record
    let aboutContent = await prisma.aboutContent.findFirst()

    // If no content exists, create default content
    if (!aboutContent) {
      aboutContent = await prisma.aboutContent.create({
        data: {
          heroTitle: 'About Carvo',
          heroSubtitle: "Morocco's premier car rental service, dedicated to providing exceptional vehicles and unforgettable journeys since 2009",
          storyTitle: 'Our Story',
          storyContent: [
            'Founded in 2009 in the heart of Casablanca, Carvo began with a simple mission: to revolutionize the car rental experience in Morocco. What started as a small fleet of 10 vehicles has grown into one of the country\'s most trusted car rental services.',
            'Over the years, we\'ve expanded our operations to 8 major cities across Morocco, serving thousands of customers from locals to international travelers. Our commitment to quality, safety, and customer satisfaction has remained unwavering.',
            'Today, Carvo is proud to offer a diverse fleet of over 500 premium vehicles, from economical sedans to luxury SUVs, ensuring that every journey is comfortable, safe, and memorable.'
          ],
          storyImage: '/logos/logo-primary-bg.png',
          missionTitle: 'Our Mission',
          missionContent: 'To provide accessible, reliable, and premium car rental services that empower people to explore Morocco with confidence and comfort. We strive to make every rental experience seamless, from booking to return.',
          visionTitle: 'Our Vision',
          visionContent: 'To become the leading car rental service across North Africa, recognized for innovation, sustainability, and exceptional customer experiences. We envision a future where renting a car is as easy as a few taps on your phone.',
          values: [
            JSON.stringify({ icon: 'shield', title: 'Trust & Reliability', description: 'We prioritize your safety and peace of mind with thoroughly inspected vehicles and transparent service.' }),
            JSON.stringify({ icon: 'star', title: 'Excellence', description: 'We strive for excellence in every aspect, from our premium fleet to our customer service.' }),
            JSON.stringify({ icon: 'users', title: 'Customer First', description: 'Your satisfaction is our success. We go the extra mile to ensure you have the best experience.' }),
            JSON.stringify({ icon: 'bolt', title: 'Innovation', description: 'We embrace technology and innovation to make car rental simple, fast, and convenient.' })
          ],
          statsTitle: 'Carvo in Numbers',
          statsSubtitle: 'Discover the impact we\'ve made in the car rental industry',
          ctaTitle: 'Ready to Start Your Journey?',
          ctaSubtitle: 'Join thousands of satisfied customers and experience the Carvo difference today',
          ctaButtonText: 'Browse Our Fleet'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: aboutContent
    })
  } catch (error) {
    console.error('Get about content error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

// POST/PUT - Update About content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get existing content
    const existing = await prisma.aboutContent.findFirst()

    let aboutContent
    if (existing) {
      // Update existing
      aboutContent = await prisma.aboutContent.update({
        where: { id: existing.id },
        data: body
      })
    } else {
      // Create new
      aboutContent = await prisma.aboutContent.create({
        data: body
      })
    }

    return NextResponse.json({
      success: true,
      message: 'About content updated successfully',
      data: aboutContent
    })
  } catch (error) {
    console.error('Update about content error:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}
