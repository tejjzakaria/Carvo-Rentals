import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Admin user details
    const adminData = {
      name: 'Admin User',
      email: 'admin@carvo.com',
      password: 'admin123', // Change this password!
      role: 'admin',
      phone: '+212 6 00 00 00 00'
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    })

    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        phone: adminData.phone
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Password:', adminData.password)
    console.log('👤 Role:', admin.role)
    console.log('\n⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
