# Google Sheets Backup Setup Guide

This guide will help you set up Google Sheets API integration for backing up your Carvo data.

## Overview

The backup feature allows you to sync your database data (Vehicles, Customers, Rentals) to a Google Sheet, which serves as a backup and allows easy data viewing/export.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter a project name (e.g., "Carvo Backup")
4. Click **"Create"**

## Step 2: Enable Google Sheets API

1. In your Google Cloud project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
3. Click on it and click **"Enable"**

## Step 3: Create Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"Service Account"**
3. Enter a name (e.g., "carvo-backup-service")
4. Click **"Create and Continue"**
5. For role, select **"Editor"** (or you can skip this step)
6. Click **"Done"**

## Step 4: Generate Service Account Key

1. In the **"Credentials"** page, find your newly created service account
2. Click on the service account email
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"Create"**
7. A JSON file will be downloaded to your computer

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"Blank"** to create a new spreadsheet
3. Rename it to something like "Carvo Backup"
4. Create three sheets inside it:
   - Right-click the bottom tab and select "Rename" → Name it **"Vehicles"**
   - Click the **"+"** button to add a new sheet → Name it **"Customers"**
   - Click the **"+"** button again → Name it **"Rentals"**
5. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

## Step 6: Share Sheet with Service Account

1. In your Google Sheet, click the **"Share"** button (top right)
2. Paste the service account email (found in the downloaded JSON file, it looks like: `carvo-backup-service@project-id.iam.gserviceaccount.com`)
3. Select **"Editor"** permission
4. Uncheck **"Notify people"**
5. Click **"Share"**

## Step 7: Configure Service Account Credentials

1. Open the downloaded JSON key file
2. Copy the entire JSON content (it should look like this):

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "carvo-backup-service@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

3. Add this environment variable to your `.env` file:

```env
# Google Sheets Backup Configuration
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

**Important Notes:**
- The `GOOGLE_SERVICE_ACCOUNT_KEY` must be the entire JSON content as a single-line string
- Make sure to wrap it in single quotes
- Keep the Spreadsheet ID from Step 5 - you'll need it in the next step

## Step 8: Configure Google Sheet ID in Settings

1. Restart your development server: `npm run dev`
2. Go to **Admin Panel** → **Settings** → **System** tab
3. Scroll down to **"Google Sheet ID (for Backup)"** field
4. Paste your Spreadsheet ID (from Step 5)
5. Click **"Save Settings"**

## Step 9: Test the Connection

1. Go to the admin panel: `http://localhost:3000/admin/backup`
2. Click **"Check Connection"**
3. If successful, you should see a green "Connected" message
4. Click **"Backup Now"** to test the sync

## Step 9: Verify the Backup

1. Click **"Open Google Sheet"** in the admin panel
2. Check that data has been synced to the three sheets:
   - **Vehicles** sheet should have all your vehicles
   - **Customers** sheet should have all your customers
   - **Rentals** sheet should have all your rentals with customer and vehicle details

## Troubleshooting

### Connection Failed

**Problem:** "Connection Failed" error when checking connection

**Solutions:**
1. Verify the service account JSON is correctly formatted in `.env`
2. Make sure there are no line breaks in the JSON string
3. Check that the spreadsheet is shared with the service account email
4. Verify the Spreadsheet ID is correct

### Permission Denied

**Problem:** "Permission denied" or "Insufficient Permission" error

**Solutions:**
1. Ensure the Google Sheet is shared with the service account email with **Editor** permission
2. Verify the Google Sheets API is enabled in your Google Cloud project
3. Check that the service account has the correct permissions

### Invalid Credentials

**Problem:** "Invalid credentials" error

**Solutions:**
1. Regenerate the service account key and update `.env`
2. Make sure the JSON is complete and not truncated
3. Verify no extra characters or spaces in the `.env` file

### Data Not Syncing

**Problem:** Connection works but data doesn't appear in sheets

**Solutions:**
1. Check that the sheet names are exactly: "Vehicles", "Customers", "Rentals" (case-sensitive)
2. Verify your database has data to sync
3. Check the browser console for any error messages

## Automation (Automatic Daily Backups)

The application is configured to automatically backup data to Google Sheets every day at 2:00 AM. This feature is **already set up** and will work automatically once you configure the Google Sheet ID.

### How It Works

The backup runs automatically in two ways depending on your deployment:

#### 1. **Vercel Deployment** (Recommended for Production)

If you deploy on Vercel, the backup uses Vercel's Cron Jobs (configured in `vercel.json`):
- **Schedule**: Every day at 2:00 AM UTC
- **Configuration**: Already set up in `vercel.json`
- **No additional setup needed**

To verify it's working on Vercel:
1. Deploy your app to Vercel
2. Go to your Vercel project dashboard
3. Navigate to **Settings** → **Cron Jobs**
4. You should see the backup cron job listed

#### 2. **Self-Hosted Deployment**

If you self-host the application, it uses node-cron (configured in `lib/cron.ts`):
- **Schedule**: Every day at 2:00 AM (server time)
- **Configuration**: Already set up in `lib/cron.ts` and enabled in `instrumentation.ts`
- **No additional setup needed**

The cron job will automatically start when you run `npm start` or `npm run dev`.

### Security (Optional but Recommended)

To prevent unauthorized access to the cron endpoint, you can set a `CRON_SECRET` in your `.env` file:

1. Generate a random secret:
   ```bash
   openssl rand -base64 32
   ```

2. Add it to your `.env` file:
   ```env
   CRON_SECRET=your-generated-secret-here
   ```

3. If using an external cron service, include the header:
   ```
   Authorization: Bearer your-generated-secret-here
   ```

### Backup Behavior

The automatic backup will:
- ✅ Only run if Google Sheet ID is configured in Settings
- ✅ Only run if Google service account key is set in environment variables
- ✅ Sync all vehicles, customers, and rentals to the Google Sheet
- ✅ Log the results in the server console
- ❌ Skip silently if Google Sheets is not configured (no errors)

### Manual Testing

You can manually trigger a backup anytime to test:
1. Go to **Admin Panel** → **Backup**
2. Click **"Backup Now"**

Or call the cron endpoint directly:
```bash
# Without CRON_SECRET
curl https://yourdomain.com/api/cron/backup

# With CRON_SECRET
curl -H "Authorization: Bearer your-secret" https://yourdomain.com/api/cron/backup
```

### Using External Cron Services (Alternative)

If you prefer using an external cron service instead:
- **Services**: [Cron-job.org](https://cron-job.org/), [EasyCron](https://www.easycron.com/)
- **Endpoint**: `https://yourdomain.com/api/cron/backup`
- **Method**: GET
- **Schedule**: `0 2 * * *` (daily at 2:00 AM)
- **Header** (if CRON_SECRET is set): `Authorization: Bearer your-secret`

## Security Notes

1. **Never commit** the service account JSON to version control
2. Keep your `.env` file private and secure
3. Regularly rotate service account keys
4. Use environment-specific service accounts for production
5. Limit service account permissions to only what's needed

## Support

If you encounter issues:
1. Check this guide thoroughly
2. Verify all steps are completed correctly
3. Check the browser console for error messages
4. Review the Google Cloud Console for API usage/errors

---

**Last Updated:** $(date '+%Y-%m-%d')
