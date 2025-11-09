/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

interface DamageDetection {
  id: string
  type: string
  location: string
  severity: 'minor' | 'moderate' | 'severe'
  description: string
  estimatedCost: number
  confidence: 'high' | 'medium' | 'low'
  photoIndex: number
  isNewDamage: boolean
}

// POST - Detect damage by comparing check-in and check-out photos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rentalId } = body

    if (!rentalId) {
      return NextResponse.json(
        { error: 'Rental ID is required' },
        { status: 400 }
      )
    }

    // Fetch rental with photos
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        vehicle: true,
        customer: true
      }
    })

    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      )
    }

    if (!rental.checkInPhotos || rental.checkInPhotos.length === 0) {
      return NextResponse.json(
        { error: 'No check-in photos found for this rental' },
        { status: 400 }
      )
    }

    if (!rental.checkOutPhotos || rental.checkOutPhotos.length === 0) {
      return NextResponse.json(
        { error: 'No check-out photos found for this rental' },
        { status: 400 }
      )
    }

    // Fetch images and convert to base64, detect media type
    const checkInImages = await Promise.all(
      rental.checkInPhotos.map(async (url) => {
        const response = await fetch(url)
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const buffer = await response.arrayBuffer()
        return {
          base64: Buffer.from(buffer).toString('base64'),
          mediaType: contentType
        }
      })
    )

    const checkOutImages = await Promise.all(
      rental.checkOutPhotos.map(async (url) => {
        const response = await fetch(url)
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const buffer = await response.arrayBuffer()
        return {
          base64: Buffer.from(buffer).toString('base64'),
          mediaType: contentType
        }
      })
    )

    // Build the prompt for Claude
    const prompt = `You are an expert vehicle damage inspector. Compare these before and after photos of a vehicle.

BEFORE PHOTOS (Check-In - when customer picked up the vehicle):
- Photo 1: Front view
- Photo 2: Back view
- Photo 3: Left side view
- Photo 4: Right side view

AFTER PHOTOS (Check-Out - when customer returned the vehicle):
- Photo 5: Front view
- Photo 6: Back view
- Photo 7: Left side view
- Photo 8: Right side view

Your task:
1. Carefully examine all 8 photos
2. Compare the AFTER photos with BEFORE photos
3. Identify any NEW damage that appears in the AFTER photos but NOT in the BEFORE photos
4. For each NEW damage found, provide detailed information

IMPORTANT:
- Only report damage that is clearly NEW (not present in check-in photos)
- Ignore pre-existing damage that was already there
- Focus on scratches, dents, broken parts, paint damage, etc.
- Be accurate and fair to avoid false claims

Return your findings as a JSON array with this exact structure:
[
  {
    "type": "scratch|dent|broken_light|paint_damage|cracked_windshield|tire_damage|bumper_damage|other",
    "location": "specific location on vehicle (e.g., 'front bumper driver side', 'rear left door')",
    "severity": "minor|moderate|severe",
    "description": "detailed description of the damage",
    "estimatedCost": estimated repair cost in USD (number),
    "confidence": "high|medium|low",
    "photoIndex": which AFTER photo index (5-8) shows this damage,
    "isNewDamage": true
  }
]

If NO new damage is detected, return an empty array: []

Return ONLY the JSON array, no other text.`

    // Prepare images for Claude
    const imageContent = [
      // Check-in photos (before)
      ...checkInImages.map((img) => ({
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: img.base64
        }
      })),
      // Check-out photos (after)
      ...checkOutImages.map((img) => ({
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: img.base64
        }
      })),
      // Text prompt
      {
        type: 'text' as const,
        text: prompt
      }
    ]

    console.log('Calling Claude API for damage detection...')

    // Call Claude Vision API
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: imageContent
        }
      ]
    })

    // Parse response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    console.log('Claude response:', responseText)

    let damages: DamageDetection[] = []
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        damages = JSON.parse(jsonMatch[0])
      } else {
        damages = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse damage detection results', rawResponse: responseText },
        { status: 500 }
      )
    }

    // Add unique IDs to damages
    const damagesWithIds = damages.map((damage, index) => ({
      ...damage,
      id: `dmg_${Date.now()}_${index}`
    }))

    // Calculate summary
    const totalEstimatedCost = damagesWithIds.reduce((sum, d) => sum + (d.estimatedCost || 0), 0)
    const overallSeverity = damagesWithIds.some(d => d.severity === 'severe')
      ? 'severe'
      : damagesWithIds.some(d => d.severity === 'moderate')
      ? 'moderate'
      : damagesWithIds.some(d => d.severity === 'minor')
      ? 'minor'
      : 'none'

    const summary = damagesWithIds.length === 0
      ? 'No new damage detected. Vehicle returned in same condition as check-in.'
      : `Detected ${damagesWithIds.length} new damage(s). Total estimated repair cost: ${totalEstimatedCost}.`

    return NextResponse.json({
      success: true,
      damageDetected: damagesWithIds.length > 0,
      damages: damagesWithIds,
      overallSeverity,
      totalEstimatedCost,
      summary,
      rentalId: rental.id,
      vehicleId: rental.vehicleId,
      customerId: rental.customerId,
      inspectionDate: new Date().toISOString(),
      tokensUsed: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens
      }
    })
  } catch (error: any) {
    console.error('Damage detection error:', error)
    return NextResponse.json(
      { error: 'Failed to detect damage', details: error.message },
      { status: 500 }
    )
  }
}
