/**
 * Script to reset a user's password
 *
 * Usage:
 * npx tsx scripts/reset-password.ts admin@carvo.com newpassword123
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetPassword(email: string, newPassword: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`❌ User with email ${email} not found`)
      return
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log(`✅ Password reset successfully for ${email}`)
    console.log(`   New password: ${newPassword}`)
  } catch (error) {
    console.error('❌ Error resetting password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const [email, newPassword] = process.argv.slice(2)

if (!email || !newPassword) {
  console.log('Usage: npx tsx scripts/reset-password.ts <email> <new-password>')
  console.log('Example: npx tsx scripts/reset-password.ts admin@carvo.com password123')
  process.exit(1)
}

resetPassword(email, newPassword)
