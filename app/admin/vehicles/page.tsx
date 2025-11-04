'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'

export default function VehiclesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/signin')
    }
  }, [router])

  const allVehicles = [
    {
      id: 1,
      name: 'Mercedes-Benz S-Class',
      category: 'Luxury',
      image: '/placeholder-car.jpg',
      price: 450,
      status: 'available',
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      plateNumber: 'ABC-1234',
      mileage: '15,000 km'
    },
    {
      id: 2,
      name: 'BMW X5',
      category: 'SUV',
      image: '/placeholder-car.jpg',
      price: 380,
      status: 'rented',
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Diesel',
        year: 2024
      },
      plateNumber: 'XYZ-5678',
      mileage: '22,000 km'
    },
    {
      id: 3,
      name: 'Toyota Camry',
      category: 'Sedan',
      image: '/placeholder-car.jpg',
      price: 180,
      status: 'available',
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        year: 2024
      },
      plateNumber: 'DEF-9012',
      mileage: '8,500 km'
    },
    {
      id: 4,
      name: 'Range Rover Sport',
      category: 'Luxury',
      image: '/placeholder-car.jpg',
      price: 520,
      status: 'available',
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      plateNumber: 'GHI-3456',
      mileage: '12,000 km'
    },
    {
      id: 5,
      name: 'Tesla Model 3',
      category: 'Electric',
      image: '/placeholder-car.jpg',
      price: 280,
      status: 'maintenance',
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric',
        year: 2024
      },
      plateNumber: 'JKL-7890',
      mileage: '18,000 km'
    },
    {
      id: 6,
      name: 'Nissan Patrol',
      category: 'SUV',
      image: '/placeholder-car.jpg',
      price: 320,
      status: 'available',
      specs: {
        seats: 8,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      plateNumber: 'MNO-2345',
      mileage: '25,000 km'
    },
    {
      id: 7,
      name: 'Audi A6',
      category: 'Luxury',
      image: '/placeholder-car.jpg',
      price: 400,
      status: 'rented',
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      plateNumber: 'PQR-6789',
      mileage: '14,000 km'
    },
    {
      id: 8,
      name: 'Honda Accord',
      category: 'Sedan',
      image: '/placeholder-car.jpg',
      price: 160,
      status: 'available',
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        year: 2024
      },
      plateNumber: 'STU-0123',
      mileage: '10,000 km'
    },
    {
      id: 9,
      name: 'Porsche 911',
      category: 'Sport',
      image: '/placeholder-car.jpg',
      price: 850,
      status: 'available',
      specs: {
        seats: 4,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      plateNumber: 'VWX-4567',
      mileage: '5,000 km'
    },
    {
      id: 10,
      name: 'Tesla Model Y',
      category: 'Electric',
      image: '/placeholder-car.jpg',
      price: 350,
      status: 'available',
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Electric',
        year: 2024
      },
      plateNumber: 'YZA-8901',
      mileage: '12,500 km'
    }
  ]

  // Filter vehicles
  const filteredVehicles = allVehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || vehicle.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rented':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'unavailable':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = [
    {
      title: 'Total Vehicles',
      value: allVehicles.length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'from-primary to-primary-dark'
    },
    {
      title: 'Available',
      value: allVehicles.filter(v => v.status === 'available').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Rented',
      value: allVehicles.filter(v => v.status === 'rented').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Maintenance',
      value: allVehicles.filter(v => v.status === 'maintenance').length,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  const categories = ['all', 'Luxury', 'SUV', 'Sedan', 'Electric', 'Sport']

  return (
    <div className='flex h-screen bg-[#FFFFFF]'>
      <AdminSidebar activePage="Vehicles" />

      <div className='flex-1 overflow-auto bg-[#F5F5F5]'>
        <AdminHeader
          title="Vehicles Management"
          subtitle="Manage your vehicle fleet"
          actionButton={{
            label: 'Add New Vehicle',
            onClick: () => router.push('/admin/vehicles/new'),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )
          }}
        />

        <main className='p-8'>
          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-6 shadow-sm border border-gray-200'
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className='text-gray-500 text-sm font-medium mb-1'>{stat.title}</h3>
                <p className='text-3xl font-bold text-[#000000]'>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6'>
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Search */}
              <div className='flex-1'>
                <div className='relative'>
                  <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type='text'
                    placeholder='Search by name or plate number...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-[#000000] placeholder:text-gray-400'
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className='flex gap-2 flex-wrap'>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      categoryFilter === category
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-300 hover:border-primary'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className='bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all'
              >
                {/* Image */}
                <div className='relative h-48 bg-linear-to-br from-gray-100 via-gray-50 to-gray-200'>
                  {/* Status Badge */}
                  <div className='absolute top-4 right-4 z-10'>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className='absolute top-4 left-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg'>
                    {vehicle.category}
                  </div>

                  {/* Car Icon Placeholder */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-primary opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                  {/* Name */}
                  <h3 className='text-xl font-bold text-[#000000] mb-2'>{vehicle.name}</h3>

                  {/* Plate Number & Mileage */}
                  <div className='flex items-center gap-4 mb-4 text-sm'>
                    <span className='text-gray-300 flex items-center gap-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {vehicle.plateNumber}
                    </span>
                    <span className='text-gray-300 flex items-center gap-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {vehicle.mileage}
                    </span>
                  </div>

                  {/* Specs */}
                  <div className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 text-xs'>
                    <span className='text-gray-300'>{vehicle.specs.seats} Seats</span>
                    <span className='text-gray-300'>{vehicle.specs.transmission}</span>
                    <span className='text-gray-300'>{vehicle.specs.fuel}</span>
                    <span className='text-gray-300'>{vehicle.specs.year}</span>
                  </div>

                  {/* Price & Actions */}
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-gray-500 uppercase tracking-wider mb-1'>Price Per Day</p>
                      <p className='text-2xl font-bold text-primary'>${vehicle.price}</p>
                    </div>

                    <div className='flex items-center gap-2'>
                      {/* View/Edit Button */}
                      <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors' title='View Details'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {/* Edit Button */}
                      <button className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors' title='Edit'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* Delete Button */}
                      <button className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors' title='Delete'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredVehicles.length === 0 && (
            <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <h3 className='text-2xl font-bold text-gray-300 mb-2'>No vehicles found</h3>
              <p className='text-gray-500 mb-6'>Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                }}
                className='px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all'
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
