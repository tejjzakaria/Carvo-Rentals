# Production Authentication Debugging Guide

## 🔴 Problem
Self-deletion prevention works in localhost but not in production. Users can delete their own account in production.

---

## 🎯 Root Cause
The `currentUserId` is not being set correctly in production, which means the check `if (id === currentUserId)` fails.

---

## 🔍 What We've Added for Debugging

### 1. Server-Side Debugging (`/lib/auth.ts`)
Added comprehensive logging to the `getCurrentUser()` function:
- ✅ Checks if AUTH_SECRET is set
- ✅ Logs AUTH_SECRET length
- ✅ Checks if token exists in cookies
- ✅ Logs token length
- ✅ Logs JWT verification success/failure
- ✅ Logs extracted user ID and email

### 2. API Endpoint Debugging (`/app/api/admin/profile/route.ts`)
Added logging to track:
- ✅ Cookie presence
- ✅ All cookies available
- ✅ Current user from token

### 3. Client-Side Debugging (`/app/admin/employees/page.tsx`)
Added logging to track:
- ✅ API call to `/api/admin/profile`
- ✅ Response status
- ✅ Response data
- ✅ Current user ID being set

### 4. Cookie Configuration (`/app/api/auth/login/route.ts`)
Fixed cookie settings:
- ✅ Added explicit `path: '/'`
- ✅ Added logging for cookie creation

---

## 🚨 CRITICAL: Check Production Environment Variables

### **Required Environment Variable**
Your production deployment **MUST** have the following environment variable set:

```bash
AUTH_SECRET="carvo-secret-key-change-this-in-production-2024"
```

⚠️ **IMPORTANT**: This value must be **EXACTLY THE SAME** as the one used when users logged in and got their JWT tokens. If you change this value, all existing user sessions will be invalidated.

### How to Check/Set in Different Platforms:

#### **Vercel**
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add: `AUTH_SECRET` = `carvo-secret-key-change-this-in-production-2024`
4. Redeploy

#### **Netlify**
1. Site settings → Environment variables
2. Add: `AUTH_SECRET` = `carvo-secret-key-change-this-in-production-2024`
3. Redeploy

#### **AWS/Docker**
Add to your environment configuration:
```bash
AUTH_SECRET=carvo-secret-key-change-this-in-production-2024
```

---

## 📋 Step-by-Step Debugging Process

### Step 1: Deploy Updated Code
Deploy the version with all the debugging logs we just added.

### Step 2: Clear Browser Cache and Re-login
1. Open production site in incognito/private window
2. Log in fresh (to get a new JWT token)
3. Navigate to Admin → Employees

### Step 3: Check Browser Console Logs
Open browser DevTools (F12) and look for these logs:

```
🔍 [Employees Page] Fetching current user from /api/admin/profile
🔍 [Employees Page] Response status: 200
🔍 [Employees Page] Response data: {...}
✅ [Employees Page] Current user ID set to: [SOME_ID]
```

**If you see:**
- ❌ Response status: 401 → Cookie not being sent or token invalid
- ❌ Response data shows error → Check server logs
- ❌ No user ID set → API is failing to extract user from token

### Step 4: Check Server Logs (Production)
Look for these logs in your production server logs:

```
🔍 [getCurrentUser] Starting authentication check
🔍 [getCurrentUser] AUTH_SECRET is set: true
🔍 [getCurrentUser] AUTH_SECRET length: 44
🔍 [getCurrentUser] Token found in cookies: true
🔍 [getCurrentUser] Token length: [some number]
🔍 [getCurrentUser] Attempting to verify token...
✅ [getCurrentUser] Token verified successfully
✅ [getCurrentUser] User ID: [SOME_ID]
✅ [getCurrentUser] User email: [EMAIL]
```

### Common Issues and Solutions:

#### ❌ `AUTH_SECRET is set: false`
**Problem**: AUTH_SECRET environment variable not set in production
**Solution**: Add AUTH_SECRET to your production environment variables

#### ❌ `Token found in cookies: false`
**Problem**: Cookie not being sent from browser to server
**Solutions**:
- Check if domain is correct (no cookie sent across domains)
- Verify HTTPS is enabled in production (secure flag requires HTTPS)
- Clear browser cache and re-login
- Check browser DevTools → Application → Cookies to see if `auth-token` exists

#### ❌ `Error verifying token: JWSSignatureVerificationFailed`
**Problem**: AUTH_SECRET in production is different from the one used to sign the token
**Solution**: Ensure AUTH_SECRET matches exactly, then have users re-login

#### ❌ `Error verifying token: JWTExpired`
**Problem**: Token has expired (set to 7 days)
**Solution**: Users need to login again

---

## ✅ How to Verify Fix Works

1. Login as Admin User A
2. Go to Admin → Employees
3. Try to select your own account checkbox → Should be disabled
4. Try to click delete button on your own account → Should show error "You cannot delete your own account"
5. Browser console should show: `✅ [Employees Page] Current user ID set to: [YOUR_ID]`

---

## 🔐 Security Recommendation

After fixing the issue, you should generate a strong, unique AUTH_SECRET for production:

```bash
# Generate a secure random secret (use one of these methods):

# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Then:
1. Update AUTH_SECRET in production environment variables
2. **Important**: All users will need to login again after this change
3. Update your local .env for consistency (optional, but recommended)

---

## 📞 Next Steps

1. ✅ Deploy the code with debugging logs
2. ✅ Check production environment variables for AUTH_SECRET
3. ✅ Test in production with browser console open
4. ✅ Share browser console logs and server logs if issue persists
5. ✅ Once fixed, optionally remove debug console.log statements

---

## 🔗 Related Files

- `/lib/auth.ts` - JWT verification logic
- `/app/api/auth/login/route.ts` - Token creation and cookie setting
- `/app/api/admin/profile/route.ts` - Current user endpoint
- `/app/admin/employees/page.tsx` - Self-deletion prevention UI
- `/.env` - Local environment variables (AUTH_SECRET on line 7)
