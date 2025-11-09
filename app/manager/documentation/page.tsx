/**
 * @author Zakaria TEJJANI
 * @email zakaria.tejjani@gmail.com
 * @date 2025-11-09
 */

'use client'
import { useState } from 'react'
import ManagerHeader from '@/components/ManagerHeader'

export default function ManagerDocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview', icon: '📚' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'rentals', label: 'Rentals', icon: '📝' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'damages', label: 'Damages', icon: '⚠️' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
  ]

  return (
    <>
      <ManagerHeader
        title="Manager Documentation"
        subtitle="Complete guide for managers"
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

        {/* Content */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
          {activeSection === 'overview' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-3xl font-bold text-[#000000] mb-4'>Manager Role Overview</h2>
                <p className='text-gray-300 mb-6'>
                  As a Manager, you have operational permissions to manage day-to-day activities of the car rental business.
                  This documentation outlines all features and capabilities available to your role.
                </p>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div className='bg-green-50 border border-green-200 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-green-800 mb-3 flex items-center gap-2'>
                    ✅ Your Permissions
                  </h3>
                  <ul className='space-y-2 text-sm text-green-700'>
                    <li>• View dashboard and statistics</li>
                    <li>• Manage rentals (create, view, edit)</li>
                    <li>• Manage vehicles (create, view, edit)</li>
                    <li>• Manage customers (create, view, edit)</li>
                    <li>• Report and manage damages</li>
                    <li>• Schedule and manage maintenance</li>
                    <li>• View calendar and bookings</li>
                    <li>• Access documentation</li>
                  </ul>
                </div>

                <div className='bg-red-50 border border-red-200 rounded-xl p-6'>
                  <h3 className='text-xl font-bold text-red-800 mb-3 flex items-center gap-2'>
                    ❌ Admin-Only Features
                  </h3>
                  <ul className='space-y-2 text-sm text-red-700'>
                    <li>• System settings and configuration</li>
                    <li>• Financial reports and analytics</li>
                    <li>• Employee management</li>
                    <li>• Content management (website)</li>
                    <li>• Newsletter and marketing</li>
                    <li>• Data backup and restore</li>
                    <li>• Notification settings</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'dashboard' && (
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-[#000000] mb-4'>Dashboard</h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-2'>Overview</h3>
                  <p className='text-gray-300'>
                    The dashboard provides a quick overview of key business metrics and recent activity.
                  </p>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-bold text-white mb-2'>Key Metrics Displayed:</h4>
                  <ul className='space-y-2 text-sm text-white'>
                    <li><strong>Total Revenue:</strong> Sum of all paid rentals</li>
                    <li><strong>Active Rentals:</strong> Currently ongoing rentals</li>
                    <li><strong>Available Vehicles:</strong> Vehicles ready for rent</li>
                    <li><strong>Total Customers:</strong> Number of registered customers</li>
                  </ul>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h4 className='font-bold text-blue-800 mb-2'>💡 Quick Actions</h4>
                  <p className='text-sm text-blue-700'>
                    Use the dashboard quick actions to create new rentals, add vehicles, or view customer lists directly from the main screen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'rentals' && (
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-[#000000] mb-4'>Rentals Management</h2>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Creating a New Rental</h3>
                  <ol className='space-y-3 text-gray-300'>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                      <div>
                        <strong>Select Customer:</strong> Use the searchable dropdown to find and select a customer. You can search by name or email.
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                      <div>
                        <strong>Choose Vehicle:</strong> Search and select an available vehicle. Vehicles with minor/moderate damage are available with warnings.
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                      <div>
                        <strong>Set Dates:</strong> Choose rental start and end dates.
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>4</span>
                      <div>
                        <strong>Add Options:</strong> Include driver service or insurance if needed.
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>5</span>
                      <div>
                        <strong>Review & Submit:</strong> Check the booking summary and submit.
                      </div>
                    </li>
                  </ol>
                </div>

                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                  <h4 className='font-bold text-yellow-800 mb-2'>⚠️ Vehicle Damage Warnings</h4>
                  <p className='text-sm text-yellow-700 mb-2'>
                    When selecting a vehicle with minor or moderate damage:
                  </p>
                  <ul className='text-sm text-yellow-700 space-y-1 ml-4'>
                    <li>• The damage details will be displayed automatically</li>
                    <li>• You must acknowledge the damage before proceeding</li>
                    <li>• Customer should be informed about existing damage</li>
                  </ul>
                </div>

                <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
                  <h4 className='font-bold text-orange-800 mb-2'>🔧 Maintenance Conflicts</h4>
                  <p className='text-sm text-orange-700 mb-2'>
                    If a vehicle has scheduled maintenance during the rental period:
                  </p>
                  <ul className='text-sm text-orange-700 space-y-1 ml-4'>
                    <li>• System will alert you of the conflict</li>
                    <li>• You can override and cancel the maintenance</li>
                    <li>• Or choose a different vehicle or date range</li>
                  </ul>
                </div>

                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 mt-6'>Rental Statuses</h3>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                      <span className='font-bold text-yellow-800'>Pending:</span>
                      <p className='text-sm text-yellow-700'>Rental created but not yet started</p>
                    </div>
                    <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                      <span className='font-bold text-green-800'>Active:</span>
                      <p className='text-sm text-green-700'>Customer currently has the vehicle</p>
                    </div>
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                      <span className='font-bold text-blue-800'>Completed:</span>
                      <p className='text-sm text-blue-700'>Rental finished, vehicle returned</p>
                    </div>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                      <span className='font-bold text-red-800'>Cancelled:</span>
                      <p className='text-sm text-red-700'>Rental was cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'vehicles' && (
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-[#000000] mb-4'>Vehicles Management</h2>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Adding a New Vehicle</h3>
                  <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
                    <p className='text-white'><strong>Basic Information:</strong></p>
                    <ul className='text-sm text-white space-y-1 ml-4'>
                      <li>• Vehicle name (e.g., "Toyota Camry 2024")</li>
                      <li>• Category (Sedan, SUV, Luxury, etc.)</li>
                      <li>• License plate number</li>
                      <li>• Year, seats, transmission, fuel type</li>
                      <li>• Current mileage</li>
                      <li>• Daily rental price</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Vehicle Statuses</h3>
                  <div className='space-y-3'>
                    <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                      <span className='font-bold text-green-800'>Available:</span>
                      <p className='text-sm text-green-700'>Ready to rent, no issues</p>
                    </div>
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                      <span className='font-bold text-blue-800'>Rented:</span>
                      <p className='text-sm text-blue-700'>Currently rented out (set automatically)</p>
                    </div>
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-3'>
                      <span className='font-bold text-orange-800'>Maintenance:</span>
                      <p className='text-sm text-orange-700'>Under maintenance, cannot be rented</p>
                    </div>
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                      <span className='font-bold text-yellow-800'>Minor Damage:</span>
                      <p className='text-sm text-yellow-700'>Can be rented with customer acknowledgment</p>
                    </div>
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-3'>
                      <span className='font-bold text-orange-800'>Moderate Damage:</span>
                      <p className='text-sm text-orange-700'>Can be rented with customer acknowledgment</p>
                    </div>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                      <span className='font-bold text-red-800'>Severe Damage:</span>
                      <p className='text-sm text-red-700'>Cannot be rented until repaired</p>
                    </div>
                  </div>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h4 className='font-bold text-blue-800 mb-2'>💡 Best Practices</h4>
                  <ul className='text-sm text-blue-700 space-y-1 ml-4'>
                    <li>• Upload clear photos of the vehicle</li>
                    <li>• Keep mileage information updated</li>
                    <li>• Add all vehicle features for better customer experience</li>
                    <li>• Update status immediately when damage is reported</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'customers' && (
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-[#000000] mb-4'>Customers Management</h2>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Adding a New Customer</h3>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <p className='text-white mb-3'><strong>Required Information:</strong></p>
                    <ul className='text-sm text-white space-y-1 ml-4'>
                      <li>• Full name</li>
                      <li>• Email address</li>
                      <li>• Phone number</li>
                      <li>• Location/City</li>
                      <li>• Status (Active/Inactive)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Customer Information</h3>
                  <p className='text-gray-300 mb-3'>Each customer profile automatically tracks:</p>
                  <ul className='text-sm text-gray-300 space-y-1 ml-4'>
                    <li>• Total number of rentals</li>
                    <li>• Total amount spent</li>
                    <li>• Rental history</li>
                    <li>• Uploaded documents</li>
                  </ul>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h4 className='font-bold text-blue-800 mb-2'>💡 Document Management</h4>
                  <p className='text-sm text-blue-700 mb-2'>
                    Customers can upload required documents through a secure link:
                  </p>
                  <ul className='text-sm text-blue-700 space-y-1 ml-4'>
                    <li>• Driver's license</li>
                    <li>• ID/Passport</li>
                    <li>• Proof of address</li>
                  </ul>
                </div>

                {/* AI Driver License Auto-Fill */}
                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mt-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🤖</span>
                    AI Driver License Auto-Fill
                  </h3>
                  <p className='text-gray-300 mb-4'>
                    Save time by automatically extracting customer information from driver license photos using AI.
                  </p>

                  <div className='bg-white rounded-xl p-5 mb-4'>
                    <h4 className='font-bold text-[#000000] mb-3'>How to Use</h4>
                    <ol className='space-y-3 text-gray-300'>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                        <div>
                          <strong className='text-[#000000]'>Create Customer:</strong> Go to customers page and click "New Customer"
                        </div>
                      </li>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                        <div>
                          <strong className='text-[#000000]'>Upload License:</strong> Click "📷 Auto-Fill from Driver License" button
                        </div>
                      </li>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                        <div>
                          <strong className='text-[#000000]'>AI Processing:</strong> AI extracts name, address, license number, dates, etc.
                        </div>
                      </li>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>4</span>
                        <div>
                          <strong className='text-[#000000]'>Verify & Save:</strong> Review auto-filled data and save customer
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className='bg-white rounded-xl p-5'>
                    <h4 className='font-bold text-[#000000] mb-3'>What Gets Extracted</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
                      <div className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Full name</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Date of birth</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span className='text-gray-300'>License number</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Expiry date</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Full address</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-blue-600 mt-1'>✓</span>
                        <span className='text-gray-300'>License class</span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-green-50 border border-green-200 rounded-lg p-4 mt-4'>
                    <h4 className='font-bold text-green-800 mb-2'>💡 Benefits</h4>
                    <ul className='text-sm text-green-700 space-y-1 ml-4'>
                      <li>• Extracts information in seconds - no manual typing needed</li>
                      <li>• Reduces data entry errors and typos</li>
                      <li>• Speeds up customer check-in process</li>
                      <li>• Works with various license formats</li>
                      <li>• Always verify extracted data before saving</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'damages' && (
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-[#000000] mb-4'>Damages Management</h2>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Reporting Damage</h3>
                  <ol className='space-y-3 text-gray-300'>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                      <div>
                        <strong>Select Vehicle:</strong> Choose the damaged vehicle
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                      <div>
                        <strong>Set Severity:</strong> Minor, Moderate, or Severe
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                      <div>
                        <strong>Describe Damage:</strong> Provide detailed description
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>4</span>
                      <div>
                        <strong>Upload Photos:</strong> Add clear images of the damage
                      </div>
                    </li>
                    <li className='flex gap-3'>
                      <span className='flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>5</span>
                      <div>
                        <strong>Set Repair Cost:</strong> Enter estimated or actual repair cost
                      </div>
                    </li>
                  </ol>
                </div>

                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                  <h4 className='font-bold text-red-800 mb-2'>⚠️ Important: Vehicle Status Updates</h4>
                  <p className='text-sm text-red-700'>
                    When damage is reported, the vehicle status is automatically updated based on severity:
                  </p>
                  <ul className='text-sm text-red-700 space-y-1 ml-4 mt-2'>
                    <li>• <strong>Minor:</strong> Can still be rented (with acknowledgment)</li>
                    <li>• <strong>Moderate:</strong> Can still be rented (with acknowledgment)</li>
                    <li>• <strong>Severe:</strong> Blocked from rentals until repaired</li>
                  </ul>
                </div>

                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Damage Statuses</h3>
                  <div className='space-y-3'>
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                      <span className='font-bold text-yellow-800'>Reported:</span>
                      <p className='text-sm text-yellow-700'>Damage logged, awaiting repair</p>
                    </div>
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-3'>
                      <span className='font-bold text-orange-800'>In Repair:</span>
                      <p className='text-sm text-orange-700'>Currently being repaired</p>
                    </div>
                    <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                      <span className='font-bold text-green-800'>Repaired:</span>
                      <p className='text-sm text-green-700'>Fixed, vehicle can return to normal status</p>
                    </div>
                  </div>
                </div>

                {/* AI Damage Detection */}
                <div className='bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 mt-6'>
                  <h3 className='text-xl font-bold text-[#000000] mb-3 flex items-center gap-2'>
                    <span className='text-2xl'>🤖</span>
                    AI-Powered Damage Detection
                  </h3>
                  <p className='text-gray-300 mb-4'>
                    Automatically detect vehicle damage using advanced AI vision technology. The system compares check-in and check-out photos to identify new damage.
                  </p>

                  <div className='bg-white rounded-xl p-5 mb-4'>
                    <h4 className='font-bold text-[#000000] mb-3'>How to Use</h4>
                    <ol className='space-y-3 text-gray-300'>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                        <div>
                          <strong className='text-[#000000]'>Upload Check-In Photos:</strong> When activating a rental, upload 4 photos (front, back, left, right)
                        </div>
                      </li>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                        <div>
                          <strong className='text-[#000000]'>Upload Check-Out Photos:</strong> When completing rental, upload 4 photos from same angles
                        </div>
                      </li>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                        <div>
                          <strong className='text-[#000000]'>Run Detection:</strong> Click "AI Damage Detection" button in rental view page
                        </div>
                      </li>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>4</span>
                        <div>
                          <strong className='text-[#000000]'>Review Results:</strong> AI shows detected damages with severity, location, and cost estimates
                        </div>
                      </li>
                      <li className='flex gap-3'>
                        <span className='flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>5</span>
                        <div>
                          <strong className='text-[#000000]'>Create Reports:</strong> Click "Create Damage Reports" to auto-generate reports for all damages
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className='bg-white rounded-xl p-5'>
                    <h4 className='font-bold text-[#000000] mb-3'>What AI Detects</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
                      <div className='flex items-start gap-2'>
                        <span className='text-purple-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Scratches and paint damage</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-purple-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Dents and body damage</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-purple-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Broken lights or mirrors</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-purple-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Cracked windshields</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-purple-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Bumper damage</span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <span className='text-purple-600 mt-1'>✓</span>
                        <span className='text-gray-300'>Tire damage</span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-green-50 border border-green-200 rounded-lg p-4 mt-4'>
                    <h4 className='font-bold text-green-800 mb-2'>💡 Benefits</h4>
                    <ul className='text-sm text-green-700 space-y-1 ml-4'>
                      <li>• Saves time: AI detection takes 5-10 seconds vs 10-15 minutes manual inspection</li>
                      <li>• Reduces customer disputes with objective AI analysis</li>
                      <li>• Provides detailed documentation for insurance claims</li>
                      <li>• Consistent quality for every rental inspection</li>
                      <li>• Very cost effective: ~$0.005 per detection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'maintenance' && (
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-[#000000] mb-4'>Maintenance Management</h2>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Scheduling Maintenance</h3>
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <p className='text-white mb-3'><strong>Required Information:</strong></p>
                    <ul className='text-sm text-white space-y-1 ml-4'>
                      <li>• Vehicle selection</li>
                      <li>• Maintenance type (Oil Change, Tire Rotation, etc.)</li>
                      <li>• Description of work needed</li>
                      <li>• Scheduled date</li>
                      <li>• Estimated cost</li>
                      <li>• Service provider (optional)</li>
                    </ul>
                  </div>
                </div>

                <div className='bg-orange-50 border border-orange-200 rounded-lg p-4'>
                  <h4 className='font-bold text-orange-800 mb-2'>⚠️ Rental Conflicts</h4>
                  <p className='text-sm text-orange-700 mb-2'>
                    The system checks for rental conflicts when scheduling maintenance:
                  </p>
                  <ul className='text-sm text-orange-700 space-y-1 ml-4'>
                    <li>• If vehicle has active/pending rental during maintenance date, you'll be notified</li>
                    <li>• Choose a different date or reschedule the rental</li>
                    <li>• System prevents double-booking automatically</li>
                  </ul>
                </div>

                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Maintenance Statuses</h3>
                  <div className='space-y-3'>
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                      <span className='font-bold text-yellow-800'>Scheduled:</span>
                      <p className='text-sm text-yellow-700'>Maintenance planned for future date</p>
                    </div>
                    <div className='bg-orange-50 border border-orange-200 rounded-lg p-3'>
                      <span className='font-bold text-orange-800'>In Progress:</span>
                      <p className='text-sm text-orange-700'>Currently being serviced</p>
                    </div>
                    <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
                      <span className='font-bold text-green-800'>Completed:</span>
                      <p className='text-sm text-green-700'>Service finished, vehicle available</p>
                    </div>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                      <span className='font-bold text-red-800'>Cancelled:</span>
                      <p className='text-sm text-red-700'>Maintenance was cancelled</p>
                    </div>
                  </div>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h4 className='font-bold text-blue-800 mb-2'>💡 Best Practices</h4>
                  <ul className='text-sm text-blue-700 space-y-1 ml-4'>
                    <li>• Schedule regular maintenance to keep vehicles in good condition</li>
                    <li>• Update mileage information when completing service</li>
                    <li>• Set next service due date for tracking</li>
                    <li>• Keep detailed notes of work performed</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'calendar' && (
            <div className='space-y-6'>
              <h2 className='text-3xl font-bold text-[#000000] mb-4'>Calendar View</h2>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xl font-bold text-[#000000] mb-3'>Overview</h3>
                  <p className='text-gray-300'>
                    The calendar provides a visual overview of all rentals, helping you manage bookings and avoid conflicts.
                  </p>
                </div>

                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-bold text-white mb-2'>Calendar Features:</h4>
                  <ul className='text-sm text-white space-y-2 ml-4'>
                    <li>• View all active and pending rentals</li>
                    <li>• Color-coded by rental status</li>
                    <li>• Monthly, weekly, and daily views</li>
                    <li>• Quick rental details on hover/click</li>
                    <li>• Filter by vehicle or customer</li>
                  </ul>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h4 className='font-bold text-blue-800 mb-2'>💡 Using the Calendar</h4>
                  <ul className='text-sm text-blue-700 space-y-1 ml-4'>
                    <li>• Check availability before creating new rentals</li>
                    <li>• Identify busy periods at a glance</li>
                    <li>• Plan maintenance during low-booking periods</li>
                    <li>• Monitor upcoming rental end dates</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
