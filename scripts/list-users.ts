/**
 * Script to list all users in the database
 *
 * Usage:
 * npx tsx scripts/list-users.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (users.length === 0) {
      console.log('No users found in the database')
    } else {
      console.log(`\nFound ${users.length} user(s):\n`)
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('Error listing users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
