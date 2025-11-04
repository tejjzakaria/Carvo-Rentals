'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  const [profileData, setProfileData] = useState({
    fullName: 'Admin User',
    email: 'admin@carvo.com',
    phone: '+212 6 12 34 56 78',
    role: 'Administrator',
    avatar: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [businessData, setBusinessData] = useState({
    companyName: 'Carvo Car Rental',
    address: '123 Boulevard Mohammed V',
    city: 'Casablanca',
    country: 'Morocco',
    phone: '+212 5 22 12 34 56',
    email: 'contact@carvo.com',
    website: 'www.carvo.com',
    taxId: 'MA123456789'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewRental: true,
    emailRentalComplete: true,
    emailPaymentReceived: true,
    emailLowInventory: false,
    smsNewRental: false,
    smsRentalReminder: true,
    smsPaymentReceived: false,
    pushNewRental: true,
    pushRentalReminder: true
  })

  const [systemSettings, setSystemSettings] = useState({
    language: 'en',
    timezone: 'Africa/Casablanca',
    currency: 'MAD',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  })

  const handleSaveProfile = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Profile updated successfully!')
    }, 1000)
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('Password changed successfully!')
    }, 1000)
  }

  const handleSaveBusiness = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Business settings updated successfully!')
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Notification preferences updated successfully!')
    }, 1000)
  }

  const handleSaveSystem = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('System settings updated successfully!')
    }, 1000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'password', label: 'Password', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
    { id: 'business', label: 'Business', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )},
    { id: 'notifications', label: 'Notifications', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
    { id: 'system', label: 'System', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )}
  ]

  return (
    <div className='flex h-screen bg-[#FFFFFF]'>
      <AdminSidebar activePage="Settings" />

      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        <AdminHeader
          title="Settings"
          subtitle="Manage your account and preferences"
        />

        <main className='p-8'>
          {/* Tabs */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6'>
            <div className='flex flex-wrap gap-2'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-300 hover:bg-primary hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 className='text-2xl font-bold text-[#000000] mb-6'>Profile Settings</h2>

              {/* Avatar Upload */}
              <div className='mb-8 pb-8 border-b border-gray-200'>
                <label className='block text-sm font-semibold text-[#000000] mb-4'>Profile Photo</label>
                <div className='flex items-center gap-6'>
                  <div className='w-24 h-24 bg-linear-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-3xl font-bold'>
                    A
                  </div>
                  <div>
                    <button className='px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold mb-2'>
                      Upload Photo
                    </button>
                    <p className='text-xs text-gray-300'>JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Full Name</label>
                  <input
                    type='text'
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Email Address</label>
                  <input
                    type='email'
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Phone Number</label>
                  <input
                    type='tel'
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Role</label>
                  <input
                    type='text'
                    value={profileData.role}
                    disabled
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-600 text-gray-300 cursor-not-allowed'
                  />
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold disabled:opacity-50'
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Password Settings */}
          {activeTab === 'password' && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 className='text-2xl font-bold text-[#000000] mb-2'>Change Password</h2>
              <p className='text-gray-300 mb-6'>Update your password to keep your account secure</p>

              <div className='max-w-2xl space-y-6 mb-6'>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Current Password</label>
                  <input
                    type='password'
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                    placeholder='Enter current password'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>New Password</label>
                  <input
                    type='password'
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                    placeholder='Enter new password'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Confirm New Password</label>
                  <input
                    type='password'
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                    placeholder='Confirm new password'
                  />
                </div>

                {/* Password Requirements */}
                <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
                  <p className='text-sm font-semibold text-[#000000] mb-2'>Password Requirements:</p>
                  <ul className='text-sm text-gray-300 space-y-1'>
                    <li>• At least 8 characters long</li>
                    <li>• Contains at least one uppercase letter</li>
                    <li>• Contains at least one lowercase letter</li>
                    <li>• Contains at least one number</li>
                  </ul>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold disabled:opacity-50'
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* Business Settings */}
          {activeTab === 'business' && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 className='text-2xl font-bold text-[#000000] mb-2'>Business Information</h2>
              <p className='text-gray-300 mb-6'>Manage your company details and contact information</p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Company Name</label>
                  <input
                    type='text'
                    value={businessData.companyName}
                    onChange={(e) => setBusinessData({ ...businessData, companyName: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Address</label>
                  <input
                    type='text'
                    value={businessData.address}
                    onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>City</label>
                  <input
                    type='text'
                    value={businessData.city}
                    onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Country</label>
                  <input
                    type='text'
                    value={businessData.country}
                    onChange={(e) => setBusinessData({ ...businessData, country: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Phone</label>
                  <input
                    type='tel'
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Email</label>
                  <input
                    type='email'
                    value={businessData.email}
                    onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Website</label>
                  <input
                    type='text'
                    value={businessData.website}
                    onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Tax ID</label>
                  <input
                    type='text'
                    value={businessData.taxId}
                    onChange={(e) => setBusinessData({ ...businessData, taxId: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  />
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={handleSaveBusiness}
                  disabled={isSaving}
                  className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold disabled:opacity-50'
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 className='text-2xl font-bold text-[#000000] mb-2'>Notification Preferences</h2>
              <p className='text-gray-300 mb-6'>Choose how you want to receive notifications</p>

              {/* Email Notifications */}
              <div className='mb-8 pb-8 border-b border-gray-200'>
                <h3 className='text-lg font-bold text-[#000000] mb-4'>Email Notifications</h3>
                <div className='space-y-4'>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>New Rental Booking</p>
                      <p className='text-sm text-gray-300'>Receive email when a new rental is created</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.emailNewRental}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNewRental: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>Rental Completed</p>
                      <p className='text-sm text-gray-300'>Receive email when a rental is completed</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.emailRentalComplete}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailRentalComplete: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>Payment Received</p>
                      <p className='text-sm text-gray-300'>Receive email when payment is received</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.emailPaymentReceived}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailPaymentReceived: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>Low Inventory Alert</p>
                      <p className='text-sm text-gray-300'>Receive email when vehicle inventory is low</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.emailLowInventory}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailLowInventory: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                </div>
              </div>

              {/* SMS Notifications */}
              <div className='mb-8 pb-8 border-b border-gray-200'>
                <h3 className='text-lg font-bold text-[#000000] mb-4'>SMS Notifications</h3>
                <div className='space-y-4'>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>New Rental Booking</p>
                      <p className='text-sm text-gray-300'>Receive SMS when a new rental is created</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.smsNewRental}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNewRental: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>Rental Reminder</p>
                      <p className='text-sm text-gray-300'>Receive SMS reminders for upcoming rentals</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.smsRentalReminder}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsRentalReminder: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>Payment Received</p>
                      <p className='text-sm text-gray-300'>Receive SMS when payment is received</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.smsPaymentReceived}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsPaymentReceived: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                </div>
              </div>

              {/* Push Notifications */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold text-[#000000] mb-4'>Push Notifications</h3>
                <div className='space-y-4'>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>New Rental Booking</p>
                      <p className='text-sm text-gray-300'>Receive push notification for new rentals</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.pushNewRental}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNewRental: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                  <label className='flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer'>
                    <div>
                      <p className='font-semibold text-[#000000]'>Rental Reminder</p>
                      <p className='text-sm text-gray-300'>Receive push reminders for upcoming rentals</p>
                    </div>
                    <input
                      type='checkbox'
                      checked={notificationSettings.pushRentalReminder}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, pushRentalReminder: e.target.checked })}
                      className='w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary'
                    />
                  </label>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold disabled:opacity-50'
                >
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
              <h2 className='text-2xl font-bold text-[#000000] mb-2'>System Settings</h2>
              <p className='text-gray-300 mb-6'>Configure system preferences and regional settings</p>

              <div className='max-w-2xl space-y-6 mb-6'>
                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Language</label>
                  <select
                    value={systemSettings.language}
                    onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  >
                    <option value='en'>English</option>
                    <option value='fr'>Français</option>
                    <option value='ar'>العربية</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Timezone</label>
                  <select
                    value={systemSettings.timezone}
                    onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  >
                    <option value='Africa/Casablanca'>Africa/Casablanca (GMT+1)</option>
                    <option value='Europe/London'>Europe/London (GMT)</option>
                    <option value='Europe/Paris'>Europe/Paris (GMT+1)</option>
                    <option value='America/New_York'>America/New_York (GMT-5)</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Currency</label>
                  <select
                    value={systemSettings.currency}
                    onChange={(e) => setSystemSettings({ ...systemSettings, currency: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  >
                    <option value='MAD'>MAD - Moroccan Dirham</option>
                    <option value='USD'>USD - US Dollar</option>
                    <option value='EUR'>EUR - Euro</option>
                    <option value='GBP'>GBP - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Date Format</label>
                  <select
                    value={systemSettings.dateFormat}
                    onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  >
                    <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                    <option value='MM/DD/YYYY'>MM/DD/YYYY</option>
                    <option value='YYYY-MM-DD'>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-[#000000] mb-2'>Time Format</label>
                  <select
                    value={systemSettings.timeFormat}
                    onChange={(e) => setSystemSettings({ ...systemSettings, timeFormat: e.target.value })}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000]'
                  >
                    <option value='24h'>24 Hour</option>
                    <option value='12h'>12 Hour (AM/PM)</option>
                  </select>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={handleSaveSystem}
                  disabled={isSaving}
                  className='px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-semibold disabled:opacity-50'
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
