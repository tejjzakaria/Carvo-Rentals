import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'your-secret-key')

export interface CurrentUser {
  id: string
  email: string
  name: string
  role: string
}

/**
 * Get the current authenticated user from the JWT token in cookies
 */
export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify(token, secret)
    const payload = verified.payload as unknown as CurrentUser

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}
