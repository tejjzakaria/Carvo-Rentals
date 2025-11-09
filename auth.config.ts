import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/app/signin'
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const userRole = auth?.user?.role
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isManagerRoute = nextUrl.pathname.startsWith('/manager')
      const isSignInPage = nextUrl.pathname === '/app/signin' || nextUrl.pathname === '/admin/signin'
      const isApiRoute = nextUrl.pathname.startsWith('/api')

      // Always allow API routes
      if (isApiRoute) {
        return true
      }

      // Allow sign-in page
      if (isSignInPage) {
        return true
      }

      // Protect admin routes - only admins can access
      if (isAdminRoute && !isLoggedIn) {
        return false
      }

      // Redirect managers trying to access admin routes
      if (isAdminRoute && userRole === 'manager' && nextUrl.pathname !== '/admin/signin') {
        return Response.redirect(new URL('/manager/dashboard', nextUrl))
      }

      // Protect manager routes - only managers can access
      if (isManagerRoute && !isLoggedIn) {
        return false
      }

      // Redirect admins trying to access manager routes to admin dashboard
      if (isManagerRoute && userRole === 'admin') {
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  }
}
