import { prisma } from '@/lib/prisma'

type NotificationType = 'rental' | 'payment' | 'customer' | 'maintenance' | 'vehicle' | 'damage'

interface CreateNotificationParams {
  type: NotificationType
  title: string
  message: string
}

/**
 * Create a notification in the database
 * This helper function can be called from any API route to create notifications
 */
export async function createNotification({ type, title, message }: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        read: false
      }
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

/**
 * Pre-built notification templates for common events
 */
export const NotificationTemplates = {
  // Rental notifications
  newRental: (customerName: string, vehicleName: string) =>
    createNotification({
      type: 'rental',
      title: 'New Rental Booking',
      message: `${customerName} booked ${vehicleName}`
    }),

  rentalCompleted: (customerName: string, vehicleName: string) =>
    createNotification({
      type: 'rental',
      title: 'Rental Completed',
      message: `${customerName} completed rental for ${vehicleName}`
    }),

  rentalCancelled: (customerName: string, vehicleName: string) =>
    createNotification({
      type: 'rental',
      title: 'Rental Cancelled',
      message: `${customerName} cancelled rental for ${vehicleName}`
    }),

  // Payment notifications
  paymentReceived: (amount: number, customerName: string) =>
    createNotification({
      type: 'payment',
      title: 'Payment Received',
      message: `Payment of $${amount.toLocaleString()} received from ${customerName}`
    }),

  paymentRefunded: (amount: number, customerName: string) =>
    createNotification({
      type: 'payment',
      title: 'Payment Refunded',
      message: `Refund of $${amount.toLocaleString()} processed for ${customerName}`
    }),

  // Customer notifications
  newCustomer: (customerName: string) =>
    createNotification({
      type: 'customer',
      title: 'New Customer',
      message: `${customerName} registered as a new customer`
    }),

  // Vehicle/Maintenance notifications
  maintenanceRequired: (vehicleName: string) =>
    createNotification({
      type: 'maintenance',
      title: 'Maintenance Alert',
      message: `${vehicleName} requires scheduled maintenance`
    }),

  vehicleAdded: (vehicleName: string) =>
    createNotification({
      type: 'maintenance',
      title: 'New Vehicle Added',
      message: `${vehicleName} has been added to the fleet`
    })
}
