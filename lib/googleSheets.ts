import { google } from 'googleapis'
import { prisma } from './prisma'

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
  try {
    // Parse the service account credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}')

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    return google.sheets({ version: 'v4', auth })
  } catch (error) {
    console.error('Failed to initialize Google Sheets client:', error)
    throw new Error('Google Sheets API not configured properly')
  }
}

// Get or create spreadsheet
export async function getOrCreateSpreadsheet() {
  const sheets = getGoogleSheetsClient()

  // Get Google Sheet ID from settings
  const settings = await prisma.settings.findFirst()
  const spreadsheetId = settings?.googleSheetId

  if (!spreadsheetId) {
    throw new Error('Google Sheet ID not configured. Please set it in Settings.')
  }

  return { sheets, spreadsheetId }
}

// Format date for Google Sheets
const formatDate = (date: Date | null) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Sync Vehicles data
export async function syncVehiclesToSheet() {
  const { sheets, spreadsheetId } = await getOrCreateSpreadsheet()

  // Fetch all vehicles
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Prepare headers
  const headers = [
    'ID',
    'Name',
    'Category',
    'Plate Number',
    'Year',
    'Seats',
    'Transmission',
    'Fuel Type',
    'Mileage',
    'Price (MAD)',
    'Status',
    'Featured',
    'Features',
    'Description',
    'Created At',
    'Updated At',
  ]

  // Prepare data rows
  const rows = vehicles.map((vehicle) => [
    vehicle.id,
    vehicle.name,
    vehicle.category,
    vehicle.plateNumber,
    vehicle.year,
    vehicle.seats,
    vehicle.transmission,
    vehicle.fuelType,
    vehicle.mileage,
    vehicle.price,
    vehicle.status,
    vehicle.featured ? 'Yes' : 'No',
    vehicle.features.join(', '),
    vehicle.description || '',
    formatDate(vehicle.createdAt),
    formatDate(vehicle.updatedAt),
  ])

  // Clear existing data and write new data
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'Vehicles!A1:Z',
  })

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Vehicles!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers, ...rows],
    },
  })

  return vehicles.length
}

// Sync Customers data
export async function syncCustomersToSheet() {
  const { sheets, spreadsheetId } = await getOrCreateSpreadsheet()

  // Fetch all customers
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Prepare headers
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Location',
    'Status',
    'Joined Date',
    'Total Rentals',
    'Total Spent (MAD)',
    'Created At',
    'Updated At',
  ]

  // Prepare data rows
  const rows = customers.map((customer) => [
    customer.id,
    customer.name,
    customer.email,
    customer.phone,
    customer.location,
    customer.status,
    formatDate(customer.joinedDate),
    customer.totalRentals,
    customer.totalSpent,
    formatDate(customer.createdAt),
    formatDate(customer.updatedAt),
  ])

  // Clear existing data and write new data
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'Customers!A1:Z',
  })

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Customers!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers, ...rows],
    },
  })

  return customers.length
}

// Sync Rentals data
export async function syncRentalsToSheet() {
  const { sheets, spreadsheetId } = await getOrCreateSpreadsheet()

  // Fetch all rentals with related data
  const rentals = await prisma.rental.findMany({
    include: {
      customer: true,
      vehicle: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Prepare headers
  const headers = [
    'ID',
    'Rental ID',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Vehicle Name',
    'Vehicle Plate',
    'Start Date',
    'End Date',
    'Status',
    'With Driver',
    'Insurance',
    'Total Amount (MAD)',
    'Payment Status',
    'Notes',
    'Created At',
    'Updated At',
  ]

  // Prepare data rows
  const rows = rentals.map((rental) => [
    rental.id,
    rental.rentalId,
    rental.customer.name,
    rental.customer.email,
    rental.customer.phone,
    rental.vehicle.name,
    rental.vehicle.plateNumber,
    formatDate(rental.startDate),
    formatDate(rental.endDate),
    rental.status,
    rental.withDriver ? 'Yes' : 'No',
    rental.insurance ? 'Yes' : 'No',
    rental.totalAmount,
    rental.paymentStatus,
    rental.notes || '',
    formatDate(rental.createdAt),
    formatDate(rental.updatedAt),
  ])

  // Clear existing data and write new data
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'Rentals!A1:Z',
  })

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Rentals!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers, ...rows],
    },
  })

  return rentals.length
}

// Sync all data
export async function syncAllDataToSheets() {
  try {
    const vehiclesCount = await syncVehiclesToSheet()
    const customersCount = await syncCustomersToSheet()
    const rentalsCount = await syncRentalsToSheet()

    return {
      success: true,
      vehiclesCount,
      customersCount,
      rentalsCount,
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Sync error:', error)
    throw error
  }
}

// Verify Google Sheets connection
export async function verifyConnection() {
  try {
    const { sheets, spreadsheetId } = await getOrCreateSpreadsheet()

    // Try to get spreadsheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    return {
      success: true,
      spreadsheetTitle: response.data.properties?.title,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
