'use client'
import { useState } from 'react'
import AdminHeader from '@/components/AdminHeader'

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: '📚' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'rentals', label: 'Rentals', icon: '📝' },
    { id: 'damages', label: 'Damages', icon: '⚠️' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'employees', label: 'Employees', icon: '👨‍💼' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'reports', label: 'Reports & Stats', icon: '📊' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'content', label: 'Content Management', icon: '📝' },
    { id: 'backup', label: 'Data Backup', icon: '☁️' },
    { id: 'branding', label: 'Branding', icon: '🎨' },
    { id: 'workflows', label: 'Workflows', icon: '🔄' },
  ]

  return (
    <>
      <AdminHeader
        title="System Documentation"
        subtitle="Complete guide to using the car rental management system"
      />

        <main className='p-8'>
          {/* Navigation Pills */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6'>
            <div className='flex flex-wrap gap-2'>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeSection === section.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-white hover:bg-gray-200'
                  }`}
                >
                  <span className='mr-2'>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className='space-y-6'>
              {/* Welcome Card */}
              <div className='bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-xl p-8'>
                <h2 className='text-3xl font-bold mb-4'>Welcome to Carvo 🚀</h2>
                <p className='text-lg opacity-90 mb-6'>
                  Your complete car rental management system designed to streamline operations,
                  manage inventory, track damages, schedule maintenance, and deliver exceptional
                  customer service.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                    <div className='text-3xl mb-2'>🚗</div>
                    <div className='font-semibold mb-1'>Fleet Management</div>
                    <div className='text-sm opacity-80'>Track all vehicles and their status</div>
                  </div>
                  <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                    <div className='text-3xl mb-2'>📊</div>
                    <div className='font-semibold mb-1'>Smart Analytics</div>
                    <div className='text-sm opacity-80'>Real-time insights and reports</div>
                  </div>
                  <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                    <div className='text-3xl mb-2'>⚡</div>
                    <div className='font-semibold mb-1'>Automated Workflows</div>
                    <div className='text-sm opacity-80'>Intelligent conflict detection</div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h3 className='text-2xl font-bold text-[#000000] mb-6'>Key Features</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors'>
                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className='font-semibold text-[#000000] mb-1'>Customer Management</h4>
                      <p className='text-sm text-gray-300'>Track customer profiles, rental history, and documents</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors'>
                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className='font-semibold text-[#000000] mb-1'>Vehicle Fleet Control</h4>
                      <p className='text-sm text-gray-300'>Manage inventory, status, and availability in real-time</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors'>
                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className='font-semibold text-[#000000] mb-1'>Rental Management</h4>
                      <p className='text-sm text-gray-300'>Create, edit, and track rentals with conflict detection</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors'>
                    <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className='font-semibold text-[#000000] mb-1'>Damage Tracking</h4>
                      <p className='text-sm text-gray-300'>Report and manage vehicle damages with photo documentation</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors'>
                    <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className='font-semibold text-[#000000] mb-1'>Maintenance Scheduling</h4>
                      <p className='text-sm text-gray-300'>Schedule and track maintenance with smart conflict alerts</p>
                    </div>
                  </div>

                  <div className='flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors'>
                    <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className='font-semibold text-[#000000] mb-1'>Smart Status Management</h4>
                      <p className='text-sm text-gray-300'>Automatic vehicle status updates based on conditions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Architecture */}
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <h3 className='text-2xl font-bold text-[#000000] mb-6'>System Architecture</h3>
                <div className='rounded-xl p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center'>
                      <div className='bg-white rounded-xl p-6 shadow-sm border-2 border-primary/20'>
                        <div className='text-4xl mb-3'>🎨</div>
                        <h4 className='font-bold text-[#000000] mb-2'>Frontend</h4>
                        <p className='text-sm text-gray-300'>Next.js 16 with TypeScript</p>
                        <p className='text-xs text-gray-500 mt-2'>React, Tailwind CSS</p>
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='bg-white rounded-xl p-6 shadow-sm border-2 border-primary/20'>
                        <div className='text-4xl mb-3'>⚙️</div>
                        <h4 className='font-bold text-[#000000] mb-2'>Backend</h4>
                        <p className='text-sm text-gray-300'>Next.js API Routes</p>
                        <p className='text-xs text-gray-500 mt-2'>RESTful Architecture</p>
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='bg-white rounded-xl p-6 shadow-sm border-2 border-primary/20'>
                        <div className='text-4xl mb-3'>🗄️</div>
                        <h4 className='font-bold text-[#000000] mb-2'>Database</h4>
                        <p className='text-sm text-gray-300'>MongoDB with Prisma</p>
                        <p className='text-xs text-gray-500 mt-2'>NoSQL Document Store</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles Section */}
          {activeSection === 'vehicles' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>🚗</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Vehicle Management</h2>
                    <p className='text-gray-300'>Complete control over your fleet</p>
                  </div>
                </div>

                {/* Vehicle Statuses */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Vehicle Status System</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className='border-2 border-green-200 bg-green-50 rounded-xl p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200'>
                          AVAILABLE
                        </span>
                      </div>
                      <p className='text-sm text-gray-300'>
                        <strong>Meaning:</strong> Vehicle is ready for rental
                      </p>
                      <p className='text-sm text-gray-300 mt-1'>
                        <strong>Actions:</strong> Can be rented immediately
                      </p>
                    </div>

                    <div className='border-2 border-blue-200 bg-blue-50 rounded-xl p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200'>
                          RENTED
                        </span>
                      </div>
                      <p className='text-sm text-gray-300'>
                        <strong>Meaning:</strong> Currently on rental
                      </p>
                      <p className='text-sm text-gray-300 mt-1'>
                        <strong>Actions:</strong> Cannot be rented, view active rental
                      </p>
                    </div>

                    <div className='border-2 border-orange-200 bg-orange-50 rounded-xl p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200'>
                          MAINTENANCE
                        </span>
                      </div>
                      <p className='text-sm text-gray-300'>
                        <strong>Meaning:</strong> Under scheduled maintenance
                      </p>
                      <p className='text-sm text-gray-300 mt-1'>
                        <strong>Actions:</strong> Cannot be rented, view maintenance
                      </p>
                    </div>

                    <div className='border-2 border-yellow-200 bg-yellow-50 rounded-xl p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200'>
                          MINOR DAMAGE
                        </span>
                      </div>
                      <p className='text-sm text-gray-300'>
                        <strong>Meaning:</strong> Has minor damage reported
                      </p>
                      <p className='text-sm text-gray-300 mt-1'>
                        <strong>Actions:</strong> ✅ Can be rented with disclaimer
                      </p>
                    </div>

                    <div className='border-2 border-orange-200 bg-orange-50 rounded-xl p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200'>
                          MODERATE DAMAGE
                        </span>
                      </div>
                      <p className='text-sm text-gray-300'>
                        <strong>Meaning:</strong> Has moderate damage reported
                      </p>
                      <p className='text-sm text-gray-300 mt-1'>
                        <strong>Actions:</strong> ✅ Can be rented with disclaimer
                      </p>
                    </div>

                    <div className='border-2 border-red-200 bg-red-50 rounded-xl p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200'>
                          SEVERE DAMAGE
                        </span>
                      </div>
                      <p className='text-sm text-gray-300'>
                        <strong>Meaning:</strong> Has severe damage reported
                      </p>
                      <p className='text-sm text-gray-300 mt-1'>
                        <strong>Actions:</strong> ❌ Cannot be rented until repaired
                      </p>
                    </div>
                  </div>
                </div>

                {/* How to Add Vehicle */}
                <div className='bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Adding a New Vehicle</h3>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>1</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Navigate to Vehicles</p>
                        <p className='text-sm text-gray-300'>Click "Add New Vehicle" button in the header</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>2</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Fill in Vehicle Details</p>
                        <p className='text-sm text-gray-300'>Name, category, plate number, year, specifications</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>3</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Set Pricing</p>
                        <p className='text-sm text-gray-300'>Daily rental rate in your configured currency</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>4</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Upload Images</p>
                        <p className='text-sm text-gray-300'>Add multiple photos of the vehicle</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>5</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Save</p>
                        <p className='text-sm text-gray-300'>Vehicle is automatically set to "Available" status</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customers Section */}
          {activeSection === 'customers' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>👥</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Customer Management</h2>
                    <p className='text-gray-300'>Build and manage your customer database</p>
                  </div>
                </div>

                {/* Customer Features */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div className='border-2 border-gray-200 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📋</span>
                      Customer Profiles
                    </h4>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Complete contact information</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Location and preferences</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Profile photo support</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Status tracking (Active/Inactive)</span>
                      </li>
                    </ul>
                  </div>

                  <div className='border-2 border-gray-200 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📊</span>
                      Rental History
                    </h4>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Total rentals counter</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Total amount spent tracker</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Detailed rental list view</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Quick access to all bookings</span>
                      </li>
                    </ul>
                  </div>

                  <div className='border-2 border-gray-200 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📄</span>
                      Document Management
                    </h4>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Driver's license upload</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>ID card verification</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Secure upload links</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Document status tracking</span>
                      </li>
                    </ul>
                  </div>

                  <div className='border-2 border-gray-200 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>🔗</span>
                      Quick Actions
                    </h4>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Create rental from profile</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>View all customer rentals</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Request document uploads</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-primary mt-1'>•</span>
                        <span>Edit customer details</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rentals Section */}
          {activeSection === 'rentals' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>📝</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Rental Management</h2>
                    <p className='text-gray-300'>Create and manage vehicle rentals</p>
                  </div>
                </div>

                {/* Rental Creation Flow */}
                <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Creating a Rental</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div className='bg-white rounded-xl p-4 border-2 border-green-200'>
                      <div className='text-3xl mb-2'>1️⃣</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Select Customer</h4>
                      <p className='text-sm text-gray-300'>Choose from existing customers or create new</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-green-200'>
                      <div className='text-3xl mb-2'>2️⃣</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Choose Vehicle</h4>
                      <p className='text-sm text-gray-300'>Select available vehicle or one with minor/moderate damage</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-green-200'>
                      <div className='text-3xl mb-2'>3️⃣</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Set Dates</h4>
                      <p className='text-sm text-gray-300'>Pick start and end dates for the rental period</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-green-200'>
                      <div className='text-3xl mb-2'>4️⃣</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Add Options</h4>
                      <p className='text-sm text-gray-300'>Select driver service, insurance, and extras</p>
                    </div>
                  </div>
                </div>

                {/* Smart Features */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Smart Rental Features</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='border-2 border-yellow-200 bg-yellow-50 rounded-xl p-4'>
                      <div className='flex items-start gap-3'>
                        <div className='text-2xl'>⚠️</div>
                        <div>
                          <h4 className='font-bold text-[#000000] mb-2'>Damage Disclaimer</h4>
                          <p className='text-sm text-gray-300 mb-2'>
                            When selecting a vehicle with minor or moderate damage:
                          </p>
                          <ul className='text-sm text-gray-300 space-y-1'>
                            <li>• System shows damage details automatically</li>
                            <li>• Photos of damage are displayed</li>
                            <li>• Admin must acknowledge damage</li>
                            <li>• Customer will be informed before pickup</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className='border-2 border-orange-200 bg-orange-50 rounded-xl p-4'>
                      <div className='flex items-start gap-3'>
                        <div className='text-2xl'>🔧</div>
                        <div>
                          <h4 className='font-bold text-[#000000] mb-2'>Maintenance Conflict Detection</h4>
                          <p className='text-sm text-gray-300 mb-2'>
                            System automatically checks for maintenance conflicts:
                          </p>
                          <ul className='text-sm text-gray-300 space-y-1'>
                            <li>• Detects scheduled maintenance during rental</li>
                            <li>• Shows conflict dialog with details</li>
                            <li>• Option to override and cancel maintenance</li>
                            <li>• Prevents double-booking automatically</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Statuses */}
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Rental Status Flow</h3>
                  <div className='flex items-center justify-between bg-gradient-to-r from-yellow-50 via-blue-50 to-green-50 rounded-xl p-6'>
                    <div className='text-center flex-1'>
                      <div className='inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 border-2 border-yellow-200'>
                        PENDING
                      </div>
                      <p className='text-xs text-gray-300 mt-2'>Created, awaiting confirmation</p>
                    </div>
                    <div className='text-2xl text-gray-400'>→</div>
                    <div className='text-center flex-1'>
                      <div className='inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 border-2 border-blue-200'>
                        ACTIVE
                      </div>
                      <p className='text-xs text-gray-300 mt-2'>Rental is ongoing</p>
                    </div>
                    <div className='text-2xl text-gray-400'>→</div>
                    <div className='text-center flex-1'>
                      <div className='inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-green-100 text-green-800 border-2 border-green-200'>
                        COMPLETED
                      </div>
                      <p className='text-xs text-gray-300 mt-2'>Vehicle returned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Damages Section */}
          {activeSection === 'damages' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>⚠️</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Damage Tracking</h2>
                    <p className='text-gray-300'>Report and manage vehicle damages</p>
                  </div>
                </div>

                {/* Severity Levels */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Damage Severity Levels</h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='border-2 border-yellow-300 bg-yellow-50 rounded-xl p-6'>
                      <div className='text-4xl mb-3 text-center'>⚠️</div>
                      <h4 className='font-bold text-[#000000] text-center mb-3'>MINOR</h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-yellow-600 mt-1'>•</span>
                          <span>Small scratches or dents</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-yellow-600 mt-1'>•</span>
                          <span>Cosmetic damage only</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-yellow-600 mt-1'>•</span>
                          <span>Vehicle status: MINOR_DAMAGE</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-green-600 mt-1'>✅</span>
                          <span><strong>Can be rented with disclaimer</strong></span>
                        </li>
                      </ul>
                    </div>

                    <div className='border-2 border-orange-300 bg-orange-50 rounded-xl p-6'>
                      <div className='text-4xl mb-3 text-center'>⚠️⚠️</div>
                      <h4 className='font-bold text-[#000000] text-center mb-3'>MODERATE</h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-orange-600 mt-1'>•</span>
                          <span>Noticeable damage</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-orange-600 mt-1'>•</span>
                          <span>May affect appearance</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-orange-600 mt-1'>•</span>
                          <span>Vehicle status: MODERATE_DAMAGE</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-green-600 mt-1'>✅</span>
                          <span><strong>Can be rented with disclaimer</strong></span>
                        </li>
                      </ul>
                    </div>

                    <div className='border-2 border-red-300 bg-red-50 rounded-xl p-6'>
                      <div className='text-4xl mb-3 text-center'>⚠️⚠️⚠️</div>
                      <h4 className='font-bold text-[#000000] text-center mb-3'>SEVERE</h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-red-600 mt-1'>•</span>
                          <span>Major structural damage</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-red-600 mt-1'>•</span>
                          <span>Safety or functionality issues</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-red-600 mt-1'>•</span>
                          <span>Vehicle status: SEVERE_DAMAGE</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-red-600 mt-1'>❌</span>
                          <span><strong>Cannot be rented until repaired</strong></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Damage Workflow */}
                <div className='bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Damage Reporting Workflow</h3>
                  <div className='space-y-4'>
                    <div className='flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-200'>
                      <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 flex-shrink-0'>1</div>
                      <div>
                        <h4 className='font-bold text-[#000000] mb-1'>Report Damage</h4>
                        <p className='text-sm text-gray-300'>Click "Report Damage" from vehicle or rental page. Select severity, add description, upload photos.</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-200'>
                      <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 flex-shrink-0'>2</div>
                      <div>
                        <h4 className='font-bold text-[#000000] mb-1'>Automatic Status Update</h4>
                        <p className='text-sm text-gray-300'>Vehicle status automatically changes based on severity: minor/moderate/severe_damage.</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-200'>
                      <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 flex-shrink-0'>3</div>
                      <div>
                        <h4 className='font-bold text-[#000000] mb-1'>Track Repairs</h4>
                        <p className='text-sm text-gray-300'>Update damage status to "In Repair" when repairs begin. Add repair costs and insurance claim details.</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-200'>
                      <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 flex-shrink-0'>4</div>
                      <div>
                        <h4 className='font-bold text-[#000000] mb-1'>Mark as Repaired</h4>
                        <p className='text-sm text-gray-300'>Set status to "Repaired" when complete. Vehicle automatically returns to "Available" if no other issues exist.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance Claims */}
                <div className='border-2 border-blue-200 bg-blue-50 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>💼</span>
                    Insurance Claims
                  </h3>
                  <p className='text-gray-300 mb-4'>When reporting damage, you can:</p>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-600 mt-1'>✓</span>
                      <span>Mark if insurance claim will be filed</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-600 mt-1'>✓</span>
                      <span>Enter claim amount</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-600 mt-1'>✓</span>
                      <span>Track total repair costs vs insurance coverage</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-600 mt-1'>✓</span>
                      <span>View all insurance claims in damage statistics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Section */}
          {activeSection === 'maintenance' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>🔧</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Maintenance Management</h2>
                    <p className='text-gray-300'>Schedule and track vehicle maintenance</p>
                  </div>
                </div>

                {/* Maintenance Types */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Maintenance Types</h3>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                    {['Oil Change', 'Tire Rotation', 'Brake Service', 'Battery Replacement',
                      'Air Filter', 'Transmission', 'Coolant Flush', 'Inspection',
                      'Alignment', 'AC Service', 'Other'].map((type) => (
                      <div key={type} className='bg-orange-50 border border-orange-200 rounded-lg p-3 text-center'>
                        <span className='text-sm font-semibold text-gray-300'>{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart Scheduling */}
                <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Smart Maintenance Scheduling</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-xl p-4 border-2 border-orange-200'>
                      <div className='text-3xl mb-2'>📅</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Future Scheduling</h4>
                      <p className='text-sm text-gray-300'>
                        Schedule maintenance for future dates without blocking the vehicle immediately.
                        Vehicle status only changes to "maintenance" when:
                      </p>
                      <ul className='mt-2 space-y-1 text-sm text-gray-300'>
                        <li>• Scheduled date arrives</li>
                        <li>• Status changed to "In Progress"</li>
                      </ul>
                    </div>

                    <div className='bg-white rounded-xl p-4 border-2 border-orange-200'>
                      <div className='text-3xl mb-2'>⚡</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Conflict Detection</h4>
                      <p className='text-sm text-gray-300'>
                        System automatically detects if a rental conflicts with scheduled maintenance:
                      </p>
                      <ul className='mt-2 space-y-1 text-sm text-gray-300'>
                        <li>• Shows override dialog</li>
                        <li>• Option to cancel maintenance</li>
                        <li>• Prevents double-booking</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Maintenance Statuses */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Maintenance Status Flow</h3>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4'>
                      <span className='inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200'>
                        SCHEDULED
                      </span>
                      <p className='text-sm text-gray-300'>Maintenance is planned for a future date. Vehicle available until that date.</p>
                    </div>

                    <div className='flex items-center gap-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4'>
                      <span className='inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200'>
                        IN PROGRESS
                      </span>
                      <p className='text-sm text-gray-300'>Maintenance is currently being performed. Vehicle status set to "maintenance".</p>
                    </div>

                    <div className='flex items-center gap-4 bg-green-50 border-2 border-green-200 rounded-xl p-4'>
                      <span className='inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-200'>
                        COMPLETED
                      </span>
                      <p className='text-sm text-gray-300'>Maintenance finished. Vehicle returns to "available" if no other issues.</p>
                    </div>

                    <div className='flex items-center gap-4 bg-red-50 border-2 border-red-200 rounded-xl p-4'>
                      <span className='inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-red-100 text-red-800 border border-red-200'>
                        CANCELLED
                      </span>
                      <p className='text-sm text-gray-300'>Maintenance was cancelled (e.g., due to rental override). Kept for records.</p>
                    </div>
                  </div>
                </div>

                {/* Recurring Maintenance */}
                <div className='border-2 border-gray-200 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🔁</span>
                    Recurring Maintenance
                  </h3>
                  <p className='text-gray-300 mb-4'>Track and plan recurring maintenance:</p>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Set "Next Service Due" date when completing maintenance</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Track mileage at service for service intervals</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>View upcoming maintenance in statistics</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Get reminded of scheduled services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Section */}
          {activeSection === 'calendar' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>📅</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Calendar View</h2>
                    <p className='text-gray-300'>Visual overview of all rentals and maintenance</p>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Calendar Features</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>📆</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Monthly View</h4>
                      <p className='text-sm text-gray-300'>View all rentals organized by month with color-coded status indicators</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>🔍</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Quick Details</h4>
                      <p className='text-sm text-gray-300'>Click any rental to view customer, vehicle, and rental details</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>🎨</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Status Colors</h4>
                      <p className='text-sm text-gray-300'>Color-coded events: Pending (yellow), Active (blue), Completed (green)</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>⚡</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Quick Navigation</h4>
                      <p className='text-sm text-gray-300'>Jump between months and years quickly to plan ahead</p>
                    </div>
                  </div>
                </div>

                <div className='border-2 border-gray-200 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>How to Use Calendar</h3>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Click on any rental event to see full details</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Use navigation arrows to move between months</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Hover over events to see quick preview information</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Filter by vehicle or customer to see specific rentals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Employees Section */}
          {activeSection === 'employees' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>👨‍💼</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Employee Management</h2>
                    <p className='text-gray-300'>Manage your team members and their roles</p>
                  </div>
                </div>

                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Employee Features</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='border-2 border-gray-200 rounded-xl p-6'>
                      <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                        <span className='text-xl'>📋</span>
                        Employee Profiles
                      </h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Full name and contact information</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Position and department</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Hire date tracking</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Employee status (Active/Inactive)</span>
                        </li>
                      </ul>
                    </div>

                    <div className='border-2 border-gray-200 rounded-xl p-6'>
                      <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                        <span className='text-xl'>💼</span>
                        Role Management
                      </h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Assign roles and responsibilities</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Track employee assignments</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Salary and compensation details</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-primary mt-1'>•</span>
                          <span>Performance notes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Adding an Employee</h3>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>1</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Navigate to Employees</p>
                        <p className='text-sm text-gray-300'>Click "Add New Employee" button</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>2</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Fill in Details</p>
                        <p className='text-sm text-gray-300'>Enter name, email, phone, position, and hire date</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>3</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Set Role & Salary</p>
                        <p className='text-sm text-gray-300'>Assign role, department, and compensation</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>4</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Save</p>
                        <p className='text-sm text-gray-300'>Employee is added to your team roster</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>🔔</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Notification System</h2>
                    <p className='text-gray-300'>Stay informed about important events</p>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Notification Types</h3>
                  <div className='space-y-3'>
                    <div className='bg-white rounded-xl p-4 border-l-4 border-blue-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>Rental Notifications</h4>
                      <p className='text-sm text-gray-300'>New rentals, upcoming returns, late returns, and completions</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-l-4 border-orange-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>Maintenance Alerts</h4>
                      <p className='text-sm text-gray-300'>Scheduled maintenance reminders and completion updates</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-l-4 border-red-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>Damage Reports</h4>
                      <p className='text-sm text-gray-300'>New damage reports and repair status updates</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-l-4 border-green-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>System Notifications</h4>
                      <p className='text-sm text-gray-300'>Backup status, system updates, and important alerts</p>
                    </div>
                  </div>
                </div>

                <div className='border-2 border-gray-200 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Managing Notifications</h3>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>View all notifications in the notifications center</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Mark notifications as read or unread</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Click on notification to jump to related item</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Clear old notifications to keep your inbox clean</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Reports & Stats Section */}
          {activeSection === 'reports' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>📊</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Reports & Statistics</h2>
                    <p className='text-gray-300'>Analytics and insights for your business</p>
                  </div>
                </div>

                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Available Reports</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='border-2 border-green-200 bg-green-50 rounded-xl p-6'>
                      <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                        <span className='text-xl'>💰</span>
                        Revenue Reports
                      </h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-green-600 mt-1'>•</span>
                          <span>Total revenue by period</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-green-600 mt-1'>•</span>
                          <span>Revenue by vehicle category</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-green-600 mt-1'>•</span>
                          <span>Monthly and yearly comparisons</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-green-600 mt-1'>•</span>
                          <span>Payment status tracking</span>
                        </li>
                      </ul>
                    </div>

                    <div className='border-2 border-blue-200 bg-blue-50 rounded-xl p-6'>
                      <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                        <span className='text-xl'>🚗</span>
                        Fleet Performance
                      </h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-blue-600 mt-1'>•</span>
                          <span>Vehicle utilization rates</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-blue-600 mt-1'>•</span>
                          <span>Most and least rented vehicles</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-blue-600 mt-1'>•</span>
                          <span>Vehicle downtime analysis</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-blue-600 mt-1'>•</span>
                          <span>Maintenance cost per vehicle</span>
                        </li>
                      </ul>
                    </div>

                    <div className='border-2 border-purple-200 bg-purple-50 rounded-xl p-6'>
                      <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                        <span className='text-xl'>👥</span>
                        Customer Analytics
                      </h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-purple-600 mt-1'>•</span>
                          <span>Top customers by revenue</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-purple-600 mt-1'>•</span>
                          <span>Customer retention rates</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-purple-600 mt-1'>•</span>
                          <span>New vs returning customers</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-purple-600 mt-1'>•</span>
                          <span>Customer lifetime value</span>
                        </li>
                      </ul>
                    </div>

                    <div className='border-2 border-orange-200 bg-orange-50 rounded-xl p-6'>
                      <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                        <span className='text-xl'>📈</span>
                        Business Metrics
                      </h4>
                      <ul className='space-y-2 text-sm text-gray-300'>
                        <li className='flex items-start gap-2'>
                          <span className='text-orange-600 mt-1'>•</span>
                          <span>Booking trends over time</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-orange-600 mt-1'>•</span>
                          <span>Average rental duration</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-orange-600 mt-1'>•</span>
                          <span>Damage and maintenance costs</span>
                        </li>
                        <li className='flex items-start gap-2'>
                          <span className='text-orange-600 mt-1'>•</span>
                          <span>Profitability by vehicle</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Dashboard Statistics</h3>
                  <p className='text-gray-300 mb-4'>Quick overview metrics available on your dashboard:</p>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='bg-white rounded-lg p-4 text-center border-2 border-gray-200'>
                      <div className='text-2xl mb-2'>📊</div>
                      <div className='font-semibold text-[#000000]'>Total Revenue</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 text-center border-2 border-gray-200'>
                      <div className='text-2xl mb-2'>🚗</div>
                      <div className='font-semibold text-[#000000]'>Active Rentals</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 text-center border-2 border-gray-200'>
                      <div className='text-2xl mb-2'>👥</div>
                      <div className='font-semibold text-[#000000]'>Total Customers</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 text-center border-2 border-gray-200'>
                      <div className='text-2xl mb-2'>🔧</div>
                      <div className='font-semibold text-[#000000]'>Vehicles in Maintenance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>📄</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Document Management</h2>
                    <p className='text-gray-300'>Secure customer document uploads and storage</p>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Document Upload System</h3>
                  <p className='text-gray-300 mb-4'>
                    The system provides secure links for customers to upload required documents like driver's licenses and ID cards.
                    All documents are stored securely in AWS S3 with proper access controls.
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white rounded-xl p-4 border-2 border-indigo-200'>
                      <div className='text-3xl mb-2'>🔐</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Secure Upload Links</h4>
                      <p className='text-sm text-gray-300'>Generate unique links for each customer to upload documents securely</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-indigo-200'>
                      <div className='text-3xl mb-2'>📋</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Document Types</h4>
                      <p className='text-sm text-gray-300'>Support for driver's license, ID cards, and other verification documents</p>
                    </div>
                  </div>
                </div>

                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>How to Request Documents</h3>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>1</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Go to Customer Profile</p>
                        <p className='text-sm text-gray-300'>Navigate to the customer who needs to upload documents</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>2</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Generate Upload Link</p>
                        <p className='text-sm text-gray-300'>Click "Request Documents" to generate a secure upload link</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>3</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Share with Customer</p>
                        <p className='text-sm text-gray-300'>Send the link to customer via email or messaging</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>4</div>
                      <div>
                        <p className='font-semibold text-[#000000]'>Review Documents</p>
                        <p className='text-sm text-gray-300'>Once uploaded, review documents in customer profile</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='border-2 border-yellow-200 bg-yellow-50 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🔒</span>
                    Security Features
                  </h3>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>Unique upload links expire after use or time limit</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>Documents stored in encrypted AWS S3 buckets</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>Access restricted to authorized admin users only</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>File type and size validation for security</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Content Management Section */}
          {activeSection === 'content' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>📝</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Content Management</h2>
                    <p className='text-gray-300'>Manage your website content and settings</p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                  <div className='border-2 border-teal-200 bg-teal-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>⭐</span>
                      Testimonials
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Manage customer testimonials and reviews</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Add customer feedback</li>
                      <li>• Star ratings</li>
                      <li>• Show/hide on website</li>
                    </ul>
                  </div>

                  <div className='border-2 border-blue-200 bg-blue-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>✨</span>
                      Features
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Highlight your service features</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Service highlights</li>
                      <li>• Icons and descriptions</li>
                      <li>• Homepage display</li>
                    </ul>
                  </div>

                  <div className='border-2 border-purple-200 bg-purple-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>❓</span>
                      FAQs
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Frequently asked questions</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Question and answers</li>
                      <li>• Categories</li>
                      <li>• FAQ page management</li>
                    </ul>
                  </div>

                  <div className='border-2 border-green-200 bg-green-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📄</span>
                      Pages
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Static page content management</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Terms &amp; Conditions</li>
                      <li>• Privacy Policy</li>
                      <li>• Cancellation Policy</li>
                    </ul>
                  </div>

                  <div className='border-2 border-orange-200 bg-orange-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📖</span>
                      About Content
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>About page content editor</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Company story</li>
                      <li>• Mission &amp; vision</li>
                      <li>• Team information</li>
                    </ul>
                  </div>

                  <div className='border-2 border-pink-200 bg-pink-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📍</span>
                      Locations
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Manage business locations</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Multiple locations</li>
                      <li>• Address &amp; contact</li>
                      <li>• Operating hours</li>
                    </ul>
                  </div>

                  <div className='border-2 border-indigo-200 bg-indigo-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📧</span>
                      Newsletter
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Newsletter subscriber management</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Subscriber list</li>
                      <li>• Export contacts</li>
                      <li>• Subscription sources</li>
                    </ul>
                  </div>

                  <div className='border-2 border-cyan-200 bg-cyan-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>🔢</span>
                      Booking Steps
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Customize booking process</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Step-by-step guide</li>
                      <li>• Icons and text</li>
                      <li>• Homepage display</li>
                    </ul>
                  </div>

                  <div className='border-2 border-yellow-200 bg-yellow-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📊</span>
                      Stats Display
                    </h4>
                    <p className='text-sm text-gray-300 mb-3'>Homepage statistics showcase</p>
                    <ul className='space-y-1 text-xs text-gray-300'>
                      <li>• Key metrics display</li>
                      <li>• Counters and numbers</li>
                      <li>• Custom statistics</li>
                    </ul>
                  </div>
                </div>

                <div className='bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Content Management Tips</h3>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Keep content fresh and updated regularly</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Use clear, concise language for better user experience</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Add high-quality images to enhance visual appeal</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Test all links and forms before publishing</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-primary mt-1'>•</span>
                      <span>Update FAQs based on common customer questions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Backup Section */}
          {activeSection === 'backup' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>☁️</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Data Backup System</h2>
                    <p className='text-gray-300'>Automatic Google Sheets backup for your data</p>
                  </div>
                </div>

                {/* Overview */}
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>How It Works</h3>
                  <p className='text-gray-300 mb-4'>
                    The system automatically backs up your rental data to a Google Sheet with separate sheets for Vehicles, Customers, and Rentals.
                    This provides an additional layer of data security and easy access to your records.
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>🚗</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Vehicles Sheet</h4>
                      <p className='text-sm text-gray-300'>Name, category, plate, year, mileage, status, pricing, and more</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>👥</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Customers Sheet</h4>
                      <p className='text-sm text-gray-300'>Contact info, location, rental history, and status</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>📝</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Rentals Sheet</h4>
                      <p className='text-sm text-gray-300'>Complete rental records with customer and vehicle details</p>
                    </div>
                  </div>
                </div>

                {/* Setup Process */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Setup Instructions</h3>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>1</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Create Google Service Account</p>
                        <p className='text-sm text-gray-300'>Follow instructions in GOOGLE_SHEETS_SETUP.md to create a service account in Google Cloud Console</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>2</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Add Service Account Key to .env</p>
                        <p className='text-sm text-gray-300'>Copy the JSON key and add it to your GOOGLE_SERVICE_ACCOUNT_KEY environment variable</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>3</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Create Google Sheet</p>
                        <p className='text-sm text-gray-300'>Create a new Google Sheet and share it with your service account email</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>4</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Configure in Settings</p>
                        <p className='text-sm text-gray-300'>Go to Settings &gt; System Settings and paste your Google Sheet ID</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Backup Options */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div className='border-2 border-green-200 bg-green-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>⏰</span>
                      Automatic Backups
                    </h4>
                    <p className='text-gray-300 mb-3'>Backups run automatically every 24 hours at 2:00 AM UTC</p>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>Works on Vercel and self-hosted deployments</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>Only runs if Google Sheet ID is configured</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>Completely hands-off once setup</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>No action needed from your side</span>
                      </li>
                    </ul>
                  </div>

                  <div className='border-2 border-blue-200 bg-blue-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>🔄</span>
                      Manual Backups
                    </h4>
                    <p className='text-gray-300 mb-3'>Trigger backups manually from the Backup page</p>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span>Go to Settings &gt; Backup page</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span>Click "Sync Now" to backup immediately</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span>View connection status and last sync time</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span>Useful for on-demand backups before major changes</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Security Note */}
                <div className='border-2 border-yellow-200 bg-yellow-50 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🔒</span>
                    Security & Privacy
                  </h3>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>Service account key should never be committed to version control</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>Google Sheet is only accessible to accounts you share it with</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>Service account has minimal permissions (only Sheets access)</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-yellow-600 mt-1'>•</span>
                      <span>All data transmission is encrypted via HTTPS</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Branding Section */}
          {activeSection === 'branding' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>🎨</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>Branding & Logos</h2>
                    <p className='text-gray-300'>Customize your company branding across the platform</p>
                  </div>
                </div>

                {/* Overview */}
                <div className='bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Logo System</h3>
                  <p className='text-gray-300 mb-4'>
                    Upload custom logos for different areas of your application. Each logo is optimized for its specific location
                    and automatically displays your company name as a fallback if no logo is uploaded.
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-white rounded-xl p-4 border-2 border-pink-200'>
                      <div className='text-3xl mb-2'>🖥️</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Admin Panel Logo</h4>
                      <p className='text-sm text-gray-300'>Displayed in the sidebar of the admin dashboard</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-purple-200'>
                      <div className='text-3xl mb-2'>🔝</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Website Header Logo</h4>
                      <p className='text-sm text-gray-300'>Shown in the navigation bar on public-facing pages</p>
                    </div>
                    <div className='bg-white rounded-xl p-4 border-2 border-blue-200'>
                      <div className='text-3xl mb-2'>⬇️</div>
                      <h4 className='font-bold text-[#000000] mb-2'>Website Footer Logo</h4>
                      <p className='text-sm text-gray-300'>Appears in the footer section of your website</p>
                    </div>
                  </div>
                </div>

                {/* Upload Instructions */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Uploading Logos</h3>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>1</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Navigate to Settings</p>
                        <p className='text-sm text-gray-300'>Go to Settings &gt; Business Settings tab</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>2</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Choose Logo Type</p>
                        <p className='text-sm text-gray-300'>Select which logo you want to upload (Panel, Header, or Footer)</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>3</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Upload Image</p>
                        <p className='text-sm text-gray-300'>Click "Upload Logo" and select your image file (JPG, PNG, WebP, or SVG)</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>4</div>
                      <div className='flex-1'>
                        <p className='font-semibold text-[#000000]'>Save Settings</p>
                        <p className='text-sm text-gray-300'>Click "Save Changes" to apply your new logos across the platform</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements & Best Practices */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                  <div className='border-2 border-blue-200 bg-blue-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>📋</span>
                      Requirements
                    </h4>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>•</span>
                        <span><strong>File types:</strong> JPG, PNG, WebP, or SVG</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>•</span>
                        <span><strong>Max size:</strong> 2MB per logo</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>•</span>
                        <span><strong>Storage:</strong> Uploaded to AWS S3</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>•</span>
                        <span><strong>Format:</strong> Transparent PNG recommended</span>
                      </li>
                    </ul>
                  </div>

                  <div className='border-2 border-green-200 bg-green-50 rounded-xl p-6'>
                    <h4 className='font-bold text-[#000000] mb-3 flex items-center gap-2'>
                      <span className='text-xl'>💡</span>
                      Best Practices
                    </h4>
                    <ul className='space-y-2 text-sm text-gray-300'>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>Use horizontal logos for better display</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>PNG with transparency works best</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>Recommended dimensions: 200x60px</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-green-600 mt-1'>✓</span>
                        <span>Keep file size small for fast loading</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Fallback Behavior */}
                <div className='border-2 border-purple-200 bg-purple-50 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🔄</span>
                    Automatic Fallback
                  </h3>
                  <p className='text-gray-300 mb-4'>
                    If no logo is uploaded for a specific location, the system automatically displays your company name
                    instead. This ensures your branding is always present, even without custom logos.
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-white rounded-lg p-4 border border-purple-200'>
                      <h5 className='font-semibold text-[#000000] mb-2'>Admin Panel</h5>
                      <p className='text-xs text-gray-300'>Shows company name in primary color or first letter badge when collapsed</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 border border-purple-200'>
                      <h5 className='font-semibold text-[#000000] mb-2'>Header</h5>
                      <p className='text-xs text-gray-300'>Displays company name in large bold text with primary color</p>
                    </div>
                    <div className='bg-white rounded-lg p-4 border border-purple-200'>
                      <h5 className='font-semibold text-[#000000] mb-2'>Footer</h5>
                      <p className='text-xs text-gray-300'>Shows company name in bold text with primary color styling</p>
                    </div>
                  </div>
                </div>

                {/* Managing Logos */}
                <div className='border-2 border-orange-200 bg-orange-50 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>⚙️</span>
                    Managing Your Logos
                  </h3>
                  <div className='space-y-3'>
                    <div className='bg-white rounded-lg p-4'>
                      <h4 className='font-semibold text-[#000000] mb-2'>Preview</h4>
                      <p className='text-sm text-gray-300'>After uploading, you'll see a preview of your logo before saving</p>
                    </div>
                    <div className='bg-white rounded-lg p-4'>
                      <h4 className='font-semibold text-[#000000] mb-2'>Replace</h4>
                      <p className='text-sm text-gray-300'>Upload a new logo to replace the existing one - the old one is automatically removed</p>
                    </div>
                    <div className='bg-white rounded-lg p-4'>
                      <h4 className='font-semibold text-[#000000] mb-2'>Remove</h4>
                      <p className='text-sm text-gray-300'>Click "Remove Logo" to delete the current logo and revert to company name display</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflows Section */}
          {activeSection === 'workflows' && (
            <div className='space-y-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl'>🔄</span>
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-[#000000]'>System Workflows</h2>
                    <p className='text-gray-300'>Understanding automated processes</p>
                  </div>
                </div>

                {/* Vehicle Status Management */}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Automatic Vehicle Status Management</h3>
                  <div className='border-2 border-black rounded-xl p-6'>
                    <p className='text-gray-300 mb-4'>The system automatically manages vehicle statuses based on multiple conditions. Here's the priority order:</p>
                    <div className='space-y-3'>
                      <div className='flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-red-200'>
                        <div className='font-bold text-red-600 text-lg'>1</div>
                        <div>
                          <h4 className='font-bold text-[#000000]'>Severe Damage (Highest Priority)</h4>
                          <p className='text-sm text-gray-300'>If ANY severe damage exists → Status: SEVERE_DAMAGE</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-orange-200'>
                        <div className='font-bold text-orange-600 text-lg'>2</div>
                        <div>
                          <h4 className='font-bold text-[#000000]'>Moderate Damage</h4>
                          <p className='text-sm text-gray-300'>If ANY moderate damage (and no severe) → Status: MODERATE_DAMAGE</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-yellow-200'>
                        <div className='font-bold text-yellow-600 text-lg'>3</div>
                        <div>
                          <h4 className='font-bold text-[#000000]'>Minor Damage</h4>
                          <p className='text-sm text-gray-300'>If ANY minor damage (and no severe/moderate) → Status: MINOR_DAMAGE</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-orange-200'>
                        <div className='font-bold text-orange-600 text-lg'>4</div>
                        <div>
                          <h4 className='font-bold text-[#000000]'>Active Maintenance</h4>
                          <p className='text-sm text-gray-300'>If maintenance in progress or due today (and no damage) → Status: MAINTENANCE</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3 bg-white rounded-lg p-4 border-2 border-green-200'>
                        <div className='font-bold text-green-600 text-lg'>5</div>
                        <div>
                          <h4 className='font-bold text-[#000000]'>Available</h4>
                          <p className='text-sm text-gray-300'>If no damage or active maintenance → Status: AVAILABLE</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complete Rental Workflow */}
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Complete Rental Workflow</h3>
                  <div className='space-y-4'>
                    <div className='bg-white rounded-xl p-4 border-l-4 border-blue-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>Step 1: Create Rental</h4>
                      <ul className='text-sm text-gray-300 space-y-1'>
                        <li>• Select customer and vehicle</li>
                        <li>• Choose rental dates</li>
                        <li>• System checks for maintenance conflicts</li>
                        <li>• If damage exists, show disclaimer</li>
                        <li>• Acknowledge disclaimers/override conflicts</li>
                        <li>• Vehicle status → RENTED</li>
                      </ul>
                    </div>

                    <div className='bg-white rounded-xl p-4 border-l-4 border-green-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>Step 2: During Rental</h4>
                      <ul className='text-sm text-gray-300 space-y-1'>
                        <li>• Vehicle shows as "rented" in system</li>
                        <li>• Cannot be selected for other rentals</li>
                        <li>• Can report damage from rental page</li>
                        <li>• Track rental progress</li>
                      </ul>
                    </div>

                    <div className='bg-white rounded-xl p-4 border-l-4 border-purple-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>Step 3: Return & Inspection</h4>
                      <ul className='text-sm text-gray-300 space-y-1'>
                        <li>• Mark rental as "completed"</li>
                        <li>• Inspect vehicle for new damage</li>
                        <li>• Report any damage found</li>
                        <li>• Update payment status</li>
                      </ul>
                    </div>

                    <div className='bg-white rounded-xl p-4 border-l-4 border-orange-500'>
                      <h4 className='font-bold text-[#000000] mb-2'>Step 4: Post-Rental</h4>
                      <ul className='text-sm text-gray-300 space-y-1'>
                        <li>• System recalculates vehicle status</li>
                        <li>• If damage reported → damage status</li>
                        <li>• If maintenance scheduled → check dates</li>
                        <li>• Otherwise → AVAILABLE</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Conflict Resolution */}
                <div className='border-2 border-orange-300 bg-orange-50 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>Maintenance Conflict Resolution</h3>
                  <p className='text-gray-300 mb-4'>When creating or editing a rental that conflicts with scheduled maintenance:</p>
                  <div className='space-y-3'>
                    <div className='bg-white rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-xl'>1️⃣</span>
                        <h4 className='font-bold text-[#000000]'>Detection</h4>
                      </div>
                      <p className='text-sm text-gray-300'>System checks if any scheduled or in-progress maintenance falls within rental dates</p>
                    </div>

                    <div className='bg-white rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-xl'>2️⃣</span>
                        <h4 className='font-bold text-[#000000]'>Alert Dialog</h4>
                      </div>
                      <p className='text-sm text-gray-300'>Shows all conflicting maintenance records with details (type, date, cost, provider)</p>
                    </div>

                    <div className='bg-white rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-xl'>3️⃣</span>
                        <h4 className='font-bold text-[#000000]'>Admin Decision</h4>
                      </div>
                      <p className='text-sm text-gray-300'>Cancel to keep maintenance, or Override to cancel maintenance and proceed with rental</p>
                    </div>

                    <div className='bg-white rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-xl'>4️⃣</span>
                        <h4 className='font-bold text-[#000000]'>Action</h4>
                      </div>
                      <p className='text-sm text-gray-300'>If override: maintenance status → CANCELLED, rental created, maintenance record kept for history</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
    </>
  )
}
