import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Authorize called with email:', credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          console.log('User found:', user ? 'Yes' : 'No')

          if (!user) {
            console.log('User not found in database')
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          console.log('Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('Invalid password')
            return null
          }

          console.log('Auth successful, returning user')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ]
})
