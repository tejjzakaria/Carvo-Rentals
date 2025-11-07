/**
 * Script to create admin or manager users
 *
 * Usage:
 * npx tsx scripts/create-user.ts admin admin@example.com password123 "Admin User"
 * npx tsx scripts/create-user.ts manager manager@example.com password123 "Manager User"
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUser(role: 'admin' | 'manager', email: string, password: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log(`❌ User with email ${email} already exists`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    })

    console.log(`✅ ${role.toUpperCase()} user created successfully:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
  } catch (error) {
    console.error('❌ Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const [role, email, password, name] = process.argv.slice(2)

if (!role || !email || !password || !name) {
  console.log('Usage: npx tsx scripts/create-user.ts <role> <email> <password> <name>')
  console.log('Example: npx tsx scripts/create-user.ts admin admin@example.com password123 "Admin User"')
  console.log('Example: npx tsx scripts/create-user.ts manager manager@example.com password123 "Manager User"')
  process.exit(1)
}

if (role !== 'admin' && role !== 'manager') {
  console.log('❌ Role must be either "admin" or "manager"')
  process.exit(1)
}

createUser(role as 'admin' | 'manager', email, password, name)
