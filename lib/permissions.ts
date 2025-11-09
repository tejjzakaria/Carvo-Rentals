// Role-based access control (RBAC) system

export type UserRole = 'admin' | 'manager'

export interface Permission {
  page: string
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Record<string, Permission>> = {
  admin: {
    // Admin has full access to everything
    dashboard: { page: 'Dashboard', canView: true, canCreate: true, canEdit: true, canDelete: true },
    calendar: { page: 'Calendar', canView: true, canCreate: true, canEdit: true, canDelete: true },
    rentals: { page: 'Rentals', canView: true, canCreate: true, canEdit: true, canDelete: true },
    vehicles: { page: 'Vehicles', canView: true, canCreate: true, canEdit: true, canDelete: true },
    customers: { page: 'Customers', canView: true, canCreate: true, canEdit: true, canDelete: true },
    employees: { page: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: true },
    damages: { page: 'Damages', canView: true, canCreate: true, canEdit: true, canDelete: true },
    maintenance: { page: 'Maintenance', canView: true, canCreate: true, canEdit: true, canDelete: true },
    testimonials: { page: 'Testimonials', canView: true, canCreate: true, canEdit: true, canDelete: true },
    stats: { page: 'Stats', canView: true, canCreate: true, canEdit: true, canDelete: true },
    bookingSteps: { page: 'Booking Steps', canView: true, canCreate: true, canEdit: true, canDelete: true },
    features: { page: 'Features', canView: true, canCreate: true, canEdit: true, canDelete: true },
    locations: { page: 'Locations', canView: true, canCreate: true, canEdit: true, canDelete: true },
    faqs: { page: 'FAQs', canView: true, canCreate: true, canEdit: true, canDelete: true },
    pages: { page: 'Pages', canView: true, canCreate: true, canEdit: true, canDelete: true },
    newsletter: { page: 'Newsletter', canView: true, canCreate: true, canEdit: true, canDelete: true },
    aboutContent: { page: 'About Content', canView: true, canCreate: true, canEdit: true, canDelete: true },
    contacts: { page: 'Contacts', canView: true, canCreate: true, canEdit: true, canDelete: true },
    reports: { page: 'Reports', canView: true, canCreate: true, canEdit: true, canDelete: true },
    tickets: { page: 'Tickets', canView: true, canCreate: true, canEdit: true, canDelete: true },
    backup: { page: 'Backup', canView: true, canCreate: true, canEdit: true, canDelete: true },
    documentation: { page: 'Documentation', canView: true, canCreate: true, canEdit: true, canDelete: true },
    settings: { page: 'Settings', canView: true, canCreate: true, canEdit: true, canDelete: true },
    notifications: { page: 'Notifications', canView: true, canCreate: true, canEdit: true, canDelete: true },
  },
  manager: {
    // Manager has access to operational pages only
    dashboard: { page: 'Dashboard', canView: true, canCreate: false, canEdit: false, canDelete: false },
    calendar: { page: 'Calendar', canView: true, canCreate: true, canEdit: true, canDelete: true },
    rentals: { page: 'Rentals', canView: true, canCreate: true, canEdit: true, canDelete: true },
    vehicles: { page: 'Vehicles', canView: true, canCreate: true, canEdit: true, canDelete: true },
    customers: { page: 'Customers', canView: true, canCreate: true, canEdit: true, canDelete: true },
    damages: { page: 'Damages', canView: true, canCreate: true, canEdit: true, canDelete: true },
    maintenance: { page: 'Maintenance', canView: true, canCreate: true, canEdit: true, canDelete: true },
    tickets: { page: 'Tickets', canView: true, canCreate: true, canEdit: false, canDelete: false },
    documentation: { page: 'Documentation', canView: true, canCreate: false, canEdit: false, canDelete: false },
    // Manager does NOT have access to these
    employees: { page: 'Employees', canView: false, canCreate: false, canEdit: false, canDelete: false },
    testimonials: { page: 'Testimonials', canView: false, canCreate: false, canEdit: false, canDelete: false },
    stats: { page: 'Stats', canView: false, canCreate: false, canEdit: false, canDelete: false },
    bookingSteps: { page: 'Booking Steps', canView: false, canCreate: false, canEdit: false, canDelete: false },
    features: { page: 'Features', canView: false, canCreate: false, canEdit: false, canDelete: false },
    locations: { page: 'Locations', canView: false, canCreate: false, canEdit: false, canDelete: false },
    faqs: { page: 'FAQs', canView: false, canCreate: false, canEdit: false, canDelete: false },
    pages: { page: 'Pages', canView: false, canCreate: false, canEdit: false, canDelete: false },
    newsletter: { page: 'Newsletter', canView: false, canCreate: false, canEdit: false, canDelete: false },
    aboutContent: { page: 'About Content', canView: false, canCreate: false, canEdit: false, canDelete: false },
    contacts: { page: 'Contacts', canView: false, canCreate: false, canEdit: false, canDelete: false },
    reports: { page: 'Reports', canView: false, canCreate: false, canEdit: false, canDelete: false },
    backup: { page: 'Backup', canView: false, canCreate: false, canEdit: false, canDelete: false },
    settings: { page: 'Settings', canView: false, canCreate: false, canEdit: false, canDelete: false },
    notifications: { page: 'Notifications', canView: false, canCreate: false, canEdit: false, canDelete: false },
  }
}

// Helper functions to check permissions
export function canViewPage(role: UserRole, page: string): boolean {
  return ROLE_PERMISSIONS[role]?.[page]?.canView || false
}

export function canCreate(role: UserRole, page: string): boolean {
  return ROLE_PERMISSIONS[role]?.[page]?.canCreate || false
}

export function canEdit(role: UserRole, page: string): boolean {
  return ROLE_PERMISSIONS[role]?.[page]?.canEdit || false
}

export function canDelete(role: UserRole, page: string): boolean {
  return ROLE_PERMISSIONS[role]?.[page]?.canDelete || false
}

export function getPermission(role: UserRole, page: string): Permission | null {
  return ROLE_PERMISSIONS[role]?.[page] || null
}

// Check if user has any permission for a page
export function hasAnyPermission(role: UserRole, page: string): boolean {
  const permission = ROLE_PERMISSIONS[role]?.[page]
  if (!permission) return false
  return permission.canView || permission.canCreate || permission.canEdit || permission.canDelete
}

// Get all accessible pages for a role
export function getAccessiblePages(role: UserRole): string[] {
  return Object.keys(ROLE_PERMISSIONS[role]).filter(page =>
    ROLE_PERMISSIONS[role][page].canView
  )
}
