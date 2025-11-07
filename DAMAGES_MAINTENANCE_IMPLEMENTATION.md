# Damage & Maintenance Management System - Implementation Guide

## ✅ Completed Components

### 1. Database Schema (Prisma)
- **Damage Model** - Track vehicle damages with severity, costs, insurance
- **Maintenance Model** - Schedule and track vehicle maintenance
- Relations to Vehicle and Rental models established
- Auto-generated Prisma client

### 2. API Routes

#### Damages API
- `GET /api/damages` - List all damages with filtering
- `POST /api/damages` - Create new damage report
- `GET /api/damages/[id]` - Get single damage
- `PUT /api/damages/[id]` - Update damage
- `DELETE /api/damages/[id]` - Delete damage
- **Auto-updates vehicle status to 'maintenance' when damage reported**

#### Maintenance API
- `GET /api/maintenance` - List all maintenance records with filtering
- `POST /api/maintenance` - Create new maintenance record
- `GET /api/maintenance/[id]` - Get single maintenance record
- `PUT /api/maintenance/[id]` - Update maintenance
- `DELETE /api/maintenance/[id]` - Delete maintenance
- **Auto-updates vehicle status when maintenance scheduled/completed**

### 3. Admin Pages Created

✅ **Damages List** (`/admin/damages/page.tsx`)
- Dashboard with statistics (total, by status, costs, insurance claims)
- Filtering by status, severity, search
- Complete damage listing with edit/delete actions

✅ **Report Damage Form** (`/admin/damages/new/page.tsx`)
- Vehicle selection
- Optional rental linkage
- Severity levels (minor, moderate, severe)
- Repair cost tracking
- Insurance claim support
- Photo upload capability
- Real-time summary sidebar

✅ **Maintenance List** (`/admin/maintenance/page.tsx`)
- Dashboard with statistics (total, by status, costs, upcoming)
- Filtering by status, type, search
- Complete maintenance listing with edit/delete actions

### 4. Navigation
✅ Updated AdminSidebar with Damages and Maintenance menu items

## 📋 Remaining Tasks

### Pages Still Needed

1. **Edit Damage Form** (`/admin/damages/[id]/edit/page.tsx`)
   - Similar to new damage form but pre-populated
   - Add "Repaired Date" field when status = repaired
   - Load existing damage data

2. **Schedule Maintenance Form** (`/admin/maintenance/new/page.tsx`)
   - Vehicle selection
   - Maintenance type dropdown (oil_change, tire_rotation, inspection, brake_service, general_service)
   - Service provider field
   - Scheduled date picker
   - Cost input
   - Mileage tracking
   - Next service due date (for recurring)
   - Notes field

3. **Edit Maintenance Form** (`/admin/maintenance/[id]/edit/page.tsx`)
   - Similar to new maintenance form but pre-populated
   - Add "Completed Date" field when status = completed
   - Update mileage at service
   - Load existing maintenance data

### Integration Tasks

4. **Vehicle Detail Page Enhancement**
   - Add Damages tab showing all damages for this vehicle
   - Add Maintenance tab showing maintenance history
   - Quick stats: total damage cost, last maintenance date

5. **Rental Detail Page Enhancement**
   - Add Damages section showing damages linked to this rental
   - Quick action button to report damage for this rental

6. **Dashboard Alerts**
   - Show upcoming maintenance in next 7 days
   - Show vehicles with open damages
   - Cost summary widget

## 🎯 Testing Guide

### Test the Current Implementation

1. **Navigate to Damages page**: http://localhost:3000/admin/damages
   - Should see empty dashboard
   - Click "Report Damage" button

2. **Create a Test Damage**:
```javascript
// In browser console
fetch('/api/vehicles')
  .then(r => r.json())
  .then(data => {
    const vehicleId = data.vehicles[0]?.id
    return fetch('/api/damages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicleId,
        severity: 'minor',
        description: 'Test scratch on bumper',
        repairCost: 150,
        insuranceClaim: false,
        status: 'reported'
      })
    })
  })
  .then(r => r.json())
  .then(console.log)
```

3. **Navigate to Maintenance page**: http://localhost:3000/admin/maintenance
   - Should see empty dashboard

4. **Create Test Maintenance**:
```javascript
// In browser console
fetch('/api/vehicles')
  .then(r => r.json())
  .then(data => {
    const vehicleId = data.vehicles[0]?.id
    return fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicleId,
        maintenanceType: 'oil_change',
        description: 'Regular oil change',
        cost: 75,
        serviceProvider: 'Quick Lube',
        status: 'scheduled',
        scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days from now
      })
    })
  })
  .then(r => r.json())
  .then(console.log)
```

5. **Check Vehicle Status**
   - Go to `/admin/vehicles`
   - The vehicle you reported damage for should show status: "maintenance"
   - When you mark damage as "repaired" (via API), status should return to "available"

## 🔧 API Usage Examples

### Create Damage with Insurance Claim
```javascript
POST /api/damages
{
  "vehicleId": "vehicle_id_here",
  "rentalId": "rental_id_here", // optional
  "severity": "moderate",
  "description": "Dent on passenger door",
  "repairCost": 500,
  "insuranceClaim": true,
  "claimAmount": 400,
  "status": "reported",
  "images": ["url1", "url2"]
}
```

### Update Damage to Repaired
```javascript
PUT /api/damages/{id}
{
  "status": "repaired",
  "repairedDate": "2025-11-10"
}
```

### Schedule Recurring Maintenance
```javascript
POST /api/maintenance
{
  "vehicleId": "vehicle_id_here",
  "maintenanceType": "oil_change",
  "description": "5000km oil change service",
  "cost": 75,
  "serviceProvider": "Main Street Auto",
  "status": "scheduled",
  "scheduledDate": "2025-11-15",
  "nextServiceDue": "2026-02-15", // 3 months later
  "mileageAtService": 45000
}
```

## 📊 Database Schema Reference

### Damage Model
- `id` - Unique identifier
- `vehicleId` - Link to vehicle
- `rentalId` - Optional link to rental
- `severity` - minor | moderate | severe
- `description` - Damage description
- `repairCost` - Estimated/actual repair cost
- `insuranceClaim` - Boolean
- `claimAmount` - Insurance claim amount if applicable
- `status` - reported | in_repair | repaired
- `images` - Array of image URLs
- `reportedDate` - When damage was reported
- `repairedDate` - When repair was completed

### Maintenance Model
- `id` - Unique identifier
- `vehicleId` - Link to vehicle
- `maintenanceType` - Type of maintenance
- `description` - Maintenance description
- `cost` - Service cost
- `serviceProvider` - Provider name
- `status` - scheduled | in_progress | completed | cancelled
- `scheduledDate` - When service is scheduled
- `completedDate` - When service was completed
- `mileageAtService` - Odometer reading
- `nextServiceDue` - For recurring maintenance
- `notes` - Additional notes

## 🚀 Next Steps

Priority order for remaining implementation:

1. ✅ Create Schedule Maintenance form (in progress)
2. Create Edit Damage form
3. Create Edit Maintenance form
4. Add damage/maintenance tabs to vehicle detail page
5. Add damage section to rental detail page
6. Add dashboard widgets for upcoming maintenance and open damages

## 🔐 Auto Status Management

The system automatically manages vehicle status:

- When damage is reported (status: reported/in_repair) → Vehicle status set to "maintenance"
- When maintenance is scheduled/in_progress → Vehicle status set to "maintenance"
- When damage is marked repaired AND no other open issues → Vehicle status set to "available"
- When maintenance is completed AND no other open issues → Vehicle status set to "available"

This ensures vehicles are not rented out when they have issues.
