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
    console.log('🔍 [getCurrentUser] Starting authentication check')
    console.log('🔍 [getCurrentUser] AUTH_SECRET is set:', !!process.env.AUTH_SECRET)
    console.log('🔍 [getCurrentUser] AUTH_SECRET length:', process.env.AUTH_SECRET?.length || 0)

    const token = request.cookies.get('auth-token')?.value
    console.log('🔍 [getCurrentUser] Token found in cookies:', !!token)
    console.log('🔍 [getCurrentUser] Token length:', token?.length || 0)

    if (!token) {
      console.log('❌ [getCurrentUser] No token found, returning null')
      return null
    }

    console.log('🔍 [getCurrentUser] Attempting to verify token...')
    const verified = await jwtVerify(token, secret)
    const payload = verified.payload as unknown as CurrentUser

    console.log('✅ [getCurrentUser] Token verified successfully')
    console.log('✅ [getCurrentUser] User ID:', payload.id)
    console.log('✅ [getCurrentUser] User email:', payload.email)

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  } catch (error) {
    console.error('❌ [getCurrentUser] Error verifying token:', error)
    console.error('❌ [getCurrentUser] Error name:', (error as Error).name)
    console.error('❌ [getCurrentUser] Error message:', (error as Error).message)
    return null
  }
}
