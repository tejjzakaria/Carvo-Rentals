import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to generate random date within range
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to get random item from array
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

async function main() {
  console.log('🌱 Starting comprehensive database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.payment.deleteMany()
  await prisma.damage.deleteMany()
  await prisma.maintenance.deleteMany()
  await prisma.customerDocument.deleteMany()
  await prisma.rental.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.stat.deleteMany()
  await prisma.bookingStep.deleteMany()
  await prisma.feature.deleteMany()
  await prisma.location.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.page.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.contact.deleteMany()
  console.log('✓ Existing data cleared')

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@carvo.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@carvo.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+212 6 12 34 56 78'
    }
  })
  console.log('✓ Admin user created')

  // Create System Settings
  await prisma.settings.upsert({
    where: { id: '000000000000000000000001' },
    update: {},
    create: {
      id: '000000000000000000000001',
      companyName: 'Carvo Car Rental',
      address: '123 Boulevard Mohammed V',
      city: 'Casablanca',
      country: 'Morocco',
      phone: '+212 5 22 12 34 56',
      email: 'contact@carvo.com',
      website: 'www.carvo.com',
      taxId: 'MA123456789',
      language: 'en',
      timezone: 'Africa/Casablanca',
      currency: 'MAD',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
  })
  console.log('✓ Settings created')

  // Create Customers (75 customers)
  const customerNames = [
    'Ahmed Hassan', 'Sarah Johnson', 'Mohammed Alami', 'Emily Chen', 'Khalid Mansour',
    'Fatima Zahra', 'David Smith', 'Amina Benali', 'James Wilson', 'Leila Idrissi',
    'Robert Brown', 'Nadia Cherkaoui', 'Michael Davis', 'Samira Tazi', 'William Garcia',
    'Rachid El Fassi', 'Jennifer Lopez', 'Youssef Benjelloun', 'Linda Martinez', 'Omar Chraibi',
    'Patricia Anderson', 'Hassan El Amrani', 'Barbara Thomas', 'Ali Boujemaa', 'Elizabeth Taylor',
    'Mehdi Lahlou', 'Susan White', 'Karim Tahiri', 'Jessica Moore', 'Hamza Berrada',
    'Sarah Brown', 'Imad Sekkat', 'Nancy Wilson', 'Said Naciri', 'Karen Davis',
    'Tarik Belkadi', 'Betty Anderson', 'Jamal Sefrioui', 'Helen Martinez', 'Reda Benkirane',
    'Maria Rodriguez', 'Amine Laraki', 'Dorothy Lewis', 'Zakaria Marouane', 'Lisa Walker',
    'Bilal Alaoui', 'Sandra Hall', 'Othmane Chraibi', 'Ashley Allen', 'Soufiane El Haddad',
    'Kimberly Young', 'Abdelilah Zniber', 'Donna King', 'Kamal Bensouda', 'Carol Wright',
    'Nabil Benomar', 'Michelle Hill', 'Driss El Guermai', 'Laura Scott', 'Yassine Tazi',
    'Emma Thompson', 'Adil Bennani', 'Sophia Garcia', 'Mustapha Harmouch', 'Olivia Martinez',
    'Ismail Raiss', 'Ava Lopez', 'Anass Kettani', 'Isabella Gonzalez', 'Hicham Filali',
    'Mia Wilson', 'Saad Sbai', 'Charlotte Anderson', 'Mouad Benslimane', 'Amelia Thomas'
  ]

  const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan']

  const customers = []
  for (let i = 0; i < 75; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: customerNames[i],
        email: `customer${i + 1}@example.com`,
        phone: `+212 6 ${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        location: `${randomItem(cities)}, Morocco`,
        status: Math.random() > 0.15 ? 'active' : 'inactive',
        totalRentals: Math.floor(Math.random() * 30),
        totalSpent: Math.floor(Math.random() * 25000)
      }
    })
    customers.push(customer)
  }
  console.log(`✓ ${customers.length} customers created`)

  // Create Vehicles (40 vehicles)
  const vehicleData = [
    { name: 'Mercedes-Benz S-Class', category: 'Luxury', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 450 },
    { name: 'BMW 7 Series', category: 'Luxury', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 420 },
    { name: 'Audi A8', category: 'Luxury', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Diesel', price: 400 },
    { name: 'Lexus LS', category: 'Luxury', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Hybrid', price: 380 },
    { name: 'Porsche Panamera', category: 'Luxury', year: 2024, seats: 4, trans: 'Automatic', fuel: 'Petrol', price: 500 },

    { name: 'BMW X5', category: 'SUV', year: 2023, seats: 7, trans: 'Automatic', fuel: 'Diesel', price: 380 },
    { name: 'Range Rover Sport', category: 'SUV', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Diesel', price: 520 },
    { name: 'Mercedes GLE', category: 'SUV', year: 2024, seats: 7, trans: 'Automatic', fuel: 'Petrol', price: 400 },
    { name: 'Audi Q7', category: 'SUV', year: 2023, seats: 7, trans: 'Automatic', fuel: 'Diesel', price: 370 },
    { name: 'Porsche Cayenne', category: 'SUV', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 480 },
    { name: 'Land Rover Discovery', category: 'SUV', year: 2023, seats: 7, trans: 'Automatic', fuel: 'Diesel', price: 420 },
    { name: 'Volvo XC90', category: 'SUV', year: 2023, seats: 7, trans: 'Automatic', fuel: 'Hybrid', price: 360 },

    { name: 'Toyota Camry', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Hybrid', price: 180 },
    { name: 'Honda Accord', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 170 },
    { name: 'Nissan Altima', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 160 },
    { name: 'Mazda 6', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 165 },
    { name: 'Volkswagen Passat', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Diesel', price: 175 },
    { name: 'Hyundai Sonata', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Hybrid', price: 170 },

    { name: 'Tesla Model 3', category: 'Electric', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Electric', price: 280 },
    { name: 'Tesla Model S', category: 'Electric', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Electric', price: 350 },
    { name: 'Tesla Model X', category: 'Electric', year: 2024, seats: 7, trans: 'Automatic', fuel: 'Electric', price: 420 },
    { name: 'Tesla Model Y', category: 'Electric', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Electric', price: 300 },
    { name: 'BMW i4', category: 'Electric', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Electric', price: 320 },
    { name: 'Audi e-tron', category: 'Electric', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Electric', price: 340 },

    { name: 'Porsche 911', category: 'Sport', year: 2024, seats: 4, trans: 'Automatic', fuel: 'Petrol', price: 600 },
    { name: 'BMW M5', category: 'Sport', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 550 },
    { name: 'Mercedes-AMG GT', category: 'Sport', year: 2024, seats: 2, trans: 'Automatic', fuel: 'Petrol', price: 650 },
    { name: 'Audi RS7', category: 'Sport', year: 2024, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 580 },
    { name: 'Jaguar F-Type', category: 'Sport', year: 2023, seats: 2, trans: 'Automatic', fuel: 'Petrol', price: 520 },

    { name: 'Toyota Corolla', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 140 },
    { name: 'Honda Civic', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 150 },
    { name: 'Nissan Sentra', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 135 },
    { name: 'Hyundai Elantra', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 145 },
    { name: 'Kia K5', category: 'Sedan', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 155 },
    { name: 'Ford Mustang', category: 'Sport', year: 2024, seats: 4, trans: 'Automatic', fuel: 'Petrol', price: 400 },
    { name: 'Chevrolet Camaro', category: 'Sport', year: 2023, seats: 4, trans: 'Automatic', fuel: 'Petrol', price: 380 },
    { name: 'Toyota RAV4', category: 'SUV', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Hybrid', price: 250 },
    { name: 'Honda CR-V', category: 'SUV', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 240 },
    { name: 'Mazda CX-5', category: 'SUV', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 230 },
    { name: 'Nissan Rogue', category: 'SUV', year: 2023, seats: 5, trans: 'Automatic', fuel: 'Petrol', price: 225 }
  ]

  const features = [
    ['GPS Navigation', 'Bluetooth', 'Leather Seats', 'Sunroof', 'Parking Sensors', 'Climate Control'],
    ['GPS Navigation', 'Bluetooth', 'Backup Camera', 'Climate Control'],
    ['GPS Navigation', 'Bluetooth', 'Leather Seats', 'Third Row Seats', 'Parking Sensors'],
    ['GPS Navigation', 'Bluetooth', 'Autopilot', 'Premium Sound System', 'Glass Roof'],
    ['GPS Navigation', 'Bluetooth', 'Sport Mode', 'Adaptive Cruise Control']
  ]

  const statuses = ['available', 'available', 'available', 'available', 'available', 'rented', 'maintenance']

  const vehicles = []
  for (let i = 0; i < vehicleData.length; i++) {
    const vData = vehicleData[i]
    const vehicle = await prisma.vehicle.create({
      data: {
        name: vData.name,
        category: vData.category,
        plateNumber: `${String.fromCharCode(65 + Math.floor(i / 26))}-${String(10000 + i).padStart(5, '0')}`,
        year: vData.year,
        seats: vData.seats,
        transmission: vData.trans,
        fuelType: vData.fuel,
        mileage: Math.floor(Math.random() * 50000) + 5000,
        price: vData.price,
        status: randomItem(statuses),
        featured: Math.random() > 0.7,
        features: randomItem(features),
        description: `Premium ${vData.category.toLowerCase()} vehicle with excellent features`,
        images: []
      }
    })
    vehicles.push(vehicle)
  }
  console.log(`✓ ${vehicles.length} vehicles created`)

  // Create Rentals (150 rentals linking customers and vehicles)
  const rentalStatuses = ['pending', 'active', 'active', 'completed', 'completed', 'completed', 'cancelled']
  const paymentStatuses = ['pending', 'paid', 'paid', 'paid']

  const rentals = []
  for (let i = 0; i < 150; i++) {
    const customer = randomItem(customers)
    const vehicle = randomItem(vehicles)
    const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
    const endDate = new Date(startDate.getTime() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    const totalAmount = vehicle.price * days

    const rental = await prisma.rental.create({
      data: {
        rentalId: `RNT-${String(i + 1).padStart(5, '0')}`,
        customerId: customer.id,
        vehicleId: vehicle.id,
        startDate,
        endDate,
        status: randomItem(rentalStatuses),
        withDriver: Math.random() > 0.7,
        insurance: Math.random() > 0.5,
        totalAmount,
        paymentStatus: randomItem(paymentStatuses),
        notes: Math.random() > 0.7 ? 'Customer requested airport pickup' : undefined
      }
    })
    rentals.push(rental)
  }
  console.log(`✓ ${rentals.length} rentals created`)

  // Create Payments for rentals
  let paymentsCount = 0
  for (const rental of rentals) {
    if (rental.paymentStatus === 'paid') {
      await prisma.payment.create({
        data: {
          rentalId: rental.id,
          amount: rental.totalAmount,
          paymentMethod: randomItem(['card', 'cash', 'bank_transfer']),
          paymentStatus: 'completed',
          transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          paymentDate: rental.startDate
        }
      })
      paymentsCount++
    }
  }
  console.log(`✓ ${paymentsCount} payments created`)

  // Create Damages (30 damage reports)
  const severities = ['minor', 'moderate', 'severe']
  const damageStatuses = ['reported', 'in_repair', 'repaired']

  for (let i = 0; i < 30; i++) {
    const vehicle = randomItem(vehicles)
    const rental = rentals.find(r => r.vehicleId === vehicle.id) || null
    const severity = randomItem(severities)
    const repairCost = severity === 'minor' ? Math.random() * 1000 + 200 :
                       severity === 'moderate' ? Math.random() * 3000 + 1000 :
                       Math.random() * 8000 + 3000

    await prisma.damage.create({
      data: {
        vehicleId: vehicle.id,
        rentalId: rental?.id,
        severity,
        description: `${severity.charAt(0).toUpperCase() + severity.slice(1)} damage to ${randomItem(['front bumper', 'rear door', 'windshield', 'side mirror', 'wheel rim', 'headlight'])}`,
        repairCost,
        insuranceClaim: Math.random() > 0.5,
        claimAmount: Math.random() > 0.5 ? repairCost * 0.8 : undefined,
        status: randomItem(damageStatuses),
        images: [],
        reportedDate: randomDate(new Date(2024, 0, 1), new Date()),
        repairedDate: Math.random() > 0.5 ? randomDate(new Date(2024, 0, 1), new Date()) : undefined
      }
    })
  }
  console.log('✓ 30 damage reports created')

  // Create Maintenance records (50 records)
  const maintenanceTypes = ['oil_change', 'tire_rotation', 'inspection', 'brake_service', 'general_service', 'transmission_service']
  const maintenanceStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled']

  for (let i = 0; i < 50; i++) {
    const vehicle = randomItem(vehicles)
    const scheduledDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
    const status = randomItem(maintenanceStatuses)

    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle.id,
        maintenanceType: randomItem(maintenanceTypes),
        description: `Regular ${randomItem(maintenanceTypes).replace('_', ' ')} service`,
        cost: Math.random() * 1500 + 200,
        serviceProvider: randomItem(['AutoPro Garage', 'Premium Car Service', 'Quick Fix Auto', 'Elite Motors']),
        status,
        scheduledDate,
        completedDate: status === 'completed' ? new Date(scheduledDate.getTime() + 2 * 24 * 60 * 60 * 1000) : undefined,
        mileageAtService: vehicle.mileage + Math.floor(Math.random() * 5000),
        nextServiceDue: status === 'completed' ? new Date(scheduledDate.getTime() + 90 * 24 * 60 * 60 * 1000) : undefined,
        notes: Math.random() > 0.7 ? 'Parts ordered, service delayed' : undefined
      }
    })
  }
  console.log('✓ 50 maintenance records created')

  // Create Customer Documents
  let documentsCount = 0
  for (let i = 0; i < Math.min(50, customers.length); i++) {
    const customer = customers[i]
    const docTypes = ['drivers_license', 'id_card', 'proof_of_address']

    for (const docType of docTypes) {
      await prisma.customerDocument.create({
        data: {
          customerId: customer.id,
          documentType: docType,
          uploadToken: `token-${Math.random().toString(36).substr(2, 16)}`,
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: randomItem(['pending', 'uploaded', 'verified', 'rejected']),
          expiryDate: docType === 'drivers_license' ? new Date(2027, 11, 31) : undefined,
          uploadedAt: Math.random() > 0.3 ? new Date() : undefined,
          verifiedAt: Math.random() > 0.5 ? new Date() : undefined
        }
      })
      documentsCount++
    }
  }
  console.log(`✓ ${documentsCount} customer documents created`)

  // Create Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Ahmed Hassan',
        location: 'Casablanca',
        rating: 5,
        comment: 'Excellent service! The car was in perfect condition and the staff was very professional.',
        isActive: true
      },
      {
        name: 'Sarah Johnson',
        location: 'Marrakech',
        rating: 5,
        comment: 'Best car rental experience in Morocco. Highly recommended!',
        isActive: true
      },
      {
        name: 'Mohammed Alami',
        location: 'Rabat',
        rating: 4,
        comment: 'Great selection of vehicles and competitive prices. Will rent again!',
        isActive: true
      },
      {
        name: 'Emily Chen',
        location: 'Tangier',
        rating: 5,
        comment: 'Very smooth rental process. The Tesla was amazing!',
        isActive: true
      },
      {
        name: 'Khalid Mansour',
        location: 'Agadir',
        rating: 5,
        comment: 'Professional team and luxury vehicles. Perfect for business trips.',
        isActive: true
      }
    ]
  })
  console.log('✓ Testimonials created')

  // Create Stats
  await prisma.stat.createMany({
    data: [
      { number: '500+', label: 'Premium Vehicles', icon: 'car', color: 'from-blue-500 to-blue-600', order: 1 },
      { number: '25K+', label: 'Happy Customers', icon: 'users', color: 'from-green-500 to-green-600', order: 2 },
      { number: '50+', label: 'Locations', icon: 'location', color: 'from-orange-500 to-orange-600', order: 3 },
      { number: '99.9%', label: 'Satisfaction Rate', icon: 'star', color: 'from-purple-500 to-purple-600', order: 4 }
    ]
  })
  console.log('✓ Stats created')

  // Create Booking Steps
  await prisma.bookingStep.createMany({
    data: [
      { stepNumber: '01', icon: 'search', title: 'Search & Select', description: 'Browse our fleet and choose your perfect vehicle', order: 1 },
      { stepNumber: '02', icon: 'calendar', title: 'Pick Dates', description: 'Select your rental period and location', order: 2 },
      { stepNumber: '03', icon: 'payment', title: 'Make Payment', description: 'Secure online payment with multiple options', order: 3 },
      { stepNumber: '04', icon: 'car', title: 'Pick Up & Go', description: 'Collect your car and start your journey', order: 4 }
    ]
  })
  console.log('✓ Booking steps created')

  // Create Features
  await prisma.feature.createMany({
    data: [
      { icon: 'clock', title: '24/7 Availability', description: 'Round-the-clock customer support and vehicle pickup', order: 1 },
      { icon: 'shield', title: 'Full Insurance', description: 'Comprehensive coverage for peace of mind', order: 2 },
      { icon: 'price', title: 'Best Prices', description: 'Competitive rates with no hidden fees', order: 3 },
      { icon: 'location', title: 'Multiple Locations', description: 'Convenient pickup and drop-off points', order: 4 },
      { icon: 'verified', title: 'Verified Vehicles', description: 'All cars are regularly inspected and maintained', order: 5 },
      { icon: 'support', title: 'Expert Support', description: 'Professional team ready to assist you', order: 6 }
    ]
  })
  console.log('✓ Features created')

  // Create Locations
  await prisma.location.createMany({
    data: [
      { name: 'Casablanca City Center', order: 1 },
      { name: 'Casablanca Airport', order: 2 },
      { name: 'Rabat City Center', order: 3 },
      { name: 'Rabat Airport', order: 4 },
      { name: 'Marrakech City Center', order: 5 },
      { name: 'Marrakech Airport', order: 6 },
      { name: 'Tangier City Center', order: 7 },
      { name: 'Tangier Airport', order: 8 },
      { name: 'Fes City Center', order: 9 },
      { name: 'Agadir City Center', order: 10 },
      { name: 'Agadir Airport', order: 11 }
    ]
  })
  console.log('✓ Locations created')

  // Create FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: 'What documents do I need to rent a car?',
        answer: 'You need a valid driver\'s license, national ID or passport, and a credit card in your name.',
        category: 'General',
        order: 1
      },
      {
        question: 'What is the minimum age to rent a car?',
        answer: 'The minimum age is 21 years old. Drivers under 25 may be subject to a young driver surcharge.',
        category: 'General',
        order: 2
      },
      {
        question: 'Is insurance included in the rental price?',
        answer: 'Basic insurance is included. Additional coverage options are available for comprehensive protection.',
        category: 'Insurance',
        order: 3
      },
      {
        question: 'Can I modify or cancel my reservation?',
        answer: 'Yes, you can modify or cancel your reservation up to 24 hours before pickup without penalty.',
        category: 'General',
        order: 4
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and cash payments.',
        category: 'Pricing',
        order: 5
      }
    ]
  })
  console.log('✓ FAQs created')

  // Create Pages
  await prisma.page.createMany({
    data: [
      {
        title: 'Terms and Conditions',
        slug: 'terms-conditions',
        content: '<h1>Terms and Conditions</h1><p>By using our services, you agree to these terms...</p>',
        order: 1
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: '<h1>Privacy Policy</h1><p>We respect your privacy and are committed to protecting your personal data...</p>',
        order: 2
      },
      {
        title: 'Rental Agreement',
        slug: 'rental-agreement',
        content: '<h1>Rental Agreement</h1><p>This agreement outlines the terms of your vehicle rental...</p>',
        order: 3
      }
    ]
  })
  console.log('✓ Pages created')

  // Create Newsletter Subscriptions
  for (let i = 0; i < 30; i++) {
    await prisma.newsletter.create({
      data: {
        email: `subscriber${i + 1}@example.com`,
        status: Math.random() > 0.1 ? 'active' : 'unsubscribed',
        source: randomItem(['footer', 'homepage', 'checkout'])
      }
    })
  }
  console.log('✓ 30 newsletter subscriptions created')

  // Create Contact Messages
  for (let i = 0; i < 25; i++) {
    await prisma.contact.create({
      data: {
        name: randomItem(customerNames),
        email: `contact${i + 1}@example.com`,
        phone: `+212 6 ${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        subject: randomItem(['Rental Inquiry', 'Pricing Question', 'Vehicle Availability', 'Partnership Opportunity', 'Feedback']),
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        status: randomItem(['new', 'read', 'replied', 'archived'])
      }
    })
  }
  console.log('✓ 25 contact messages created')

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        type: 'rental',
        title: 'New Rental Booking',
        message: 'Ahmed Hassan booked Mercedes-Benz S-Class',
        read: false
      },
      {
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of 2,250 MAD received from Sarah Johnson',
        read: false
      },
      {
        type: 'rental',
        title: 'Rental Completed',
        message: 'Mohammed Alami completed rental for Toyota Camry',
        read: true
      },
      {
        type: 'customer',
        title: 'New Customer',
        message: 'Emily Chen registered as a new customer',
        read: true
      },
      {
        type: 'maintenance',
        title: 'Maintenance Alert',
        message: 'BMW X5 requires scheduled maintenance',
        read: true
      },
      {
        type: 'rental',
        title: 'Upcoming Rental',
        message: 'Khalid Mansour has a rental starting tomorrow',
        read: false
      }
    ]
  })
  console.log('✓ Notifications created')

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Admin Users: 1`)
  console.log(`   - Customers: ${customers.length}`)
  console.log(`   - Vehicles: ${vehicles.length}`)
  console.log(`   - Rentals: ${rentals.length}`)
  console.log(`   - Payments: ${paymentsCount}`)
  console.log(`   - Damages: 30`)
  console.log(`   - Maintenance Records: 50`)
  console.log(`   - Customer Documents: ${documentsCount}`)
  console.log(`   - Testimonials: 5`)
  console.log(`   - Stats: 4`)
  console.log(`   - Booking Steps: 4`)
  console.log(`   - Features: 6`)
  console.log(`   - Locations: 11`)
  console.log(`   - FAQs: 5`)
  console.log(`   - Pages: 3`)
  console.log(`   - Newsletter Subscriptions: 30`)
  console.log(`   - Contact Messages: 25`)
  console.log(`   - Notifications: 6`)
  console.log('\n🔑 Admin Login:')
  console.log('   Email: admin@carvo.com')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
