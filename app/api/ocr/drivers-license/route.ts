import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    console.log('OCR API called')
    const body = await request.json()
    const { imageUrl, imageBase64, mimeType } = body

    console.log('Request body received:', {
      hasImageUrl: !!imageUrl,
      hasImageBase64: !!imageBase64,
      mimeType,
      base64Length: imageBase64?.length
    })

    // Validate input
    if (!imageUrl && !imageBase64) {
      return NextResponse.json(
        { error: 'Either imageUrl or imageBase64 is required' },
        { status: 400 }
      )
    }

    // Prepare image source for Claude
    let imageSource: any

    if (imageBase64) {
      // If base64 is provided directly
      imageSource = {
        type: 'base64',
        media_type: mimeType || 'image/jpeg',
        data: imageBase64
      }
    } else if (imageUrl) {
      // If URL is provided, fetch the image and convert to base64
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch image from URL' },
          { status: 400 }
        )
      }

      const imageBuffer = await imageResponse.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString('base64')

      // Determine mime type from URL or response headers
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

      imageSource = {
        type: 'base64',
        media_type: contentType,
        data: base64Image
      }
    }

    // Call Claude API with vision
    console.log('Calling Anthropic API with model: claude-3-haiku-20240307')
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY)
    console.log('API Key prefix:', process.env.ANTHROPIC_API_KEY?.substring(0, 20))

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: imageSource
            },
            {
              type: 'text',
              text: `Analyze this driver's license image and extract the following information. Return ONLY a JSON object with these exact fields (use null for any field you cannot find or are unsure about):

{
  "name": "full name of the license holder",
  "licenseNumber": "driver's license number",
  "dateOfBirth": "date of birth in YYYY-MM-DD format",
  "address": "full address or just city/location",
  "phone": "phone number if visible",
  "expiryDate": "license expiry date in YYYY-MM-DD format",
  "issueDate": "license issue date in YYYY-MM-DD format",
  "confidence": "high/medium/low based on image quality and clarity"
}

Important:
- Only extract information you can clearly read
- Format all dates as YYYY-MM-DD
- If you see Arabic text, translate it to Latin characters
- For phone numbers, include country code if visible
- If this is not a driver's license, return: {"error": "Not a driver's license", "confidence": "high"}

Return ONLY the JSON object, no other text.`
            }
          ]
        }
      ]
    })

    // Parse Claude's response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Try to extract JSON from response
    let extractedData
    try {
      // Remove markdown code blocks if present
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0])
      } else {
        extractedData = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
      return NextResponse.json(
        {
          error: 'Failed to parse extracted data',
          rawResponse: responseText
        },
        { status: 500 }
      )
    }

    // Check if it's an error response (not a license)
    if (extractedData.error) {
      return NextResponse.json(
        {
          success: false,
          error: extractedData.error,
          message: 'The uploaded document does not appear to be a driver\'s license'
        },
        { status: 400 }
      )
    }

    // Return successful extraction
    return NextResponse.json({
      success: true,
      extractedData: {
        name: extractedData.name || null,
        licenseNumber: extractedData.licenseNumber || null,
        dateOfBirth: extractedData.dateOfBirth || null,
        address: extractedData.address || null,
        phone: extractedData.phone || null,
        expiryDate: extractedData.expiryDate || null,
        issueDate: extractedData.issueDate || null,
        confidence: extractedData.confidence || 'medium'
      },
      tokensUsed: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens
      }
    })

  } catch (error: any) {
    console.error('OCR API error:', error)
    console.error('Error type:', error.constructor.name)
    console.error('Error status:', error.status)
    console.error('Error message:', error.message)
    console.error('Full error object:', JSON.stringify(error, null, 2))

    // Handle specific Anthropic API errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key', details: error.message },
        { status: 500 }
      )
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.', details: error.message },
        { status: 429 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to process image',
        details: error.message || JSON.stringify(error)
      },
      { status: 500 }
    )
  }
}
