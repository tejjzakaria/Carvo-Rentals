import Layout from './Layout'

const FeaturedCars = () => {
  const cars = [
    {
      id: 1,
      name: 'Mercedes-Benz S-Class',
      category: 'Luxury',
      image: '/placeholder-car.jpg',
      price: 450,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['GPS Navigation', 'Bluetooth', 'Leather Seats']
    },
    {
      id: 2,
      name: 'BMW X5',
      category: 'SUV',
      image: '/placeholder-car.jpg',
      price: 380,
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Diesel',
        year: 2024
      },
      features: ['Sunroof', 'Apple CarPlay', '4WD']
    },
    {
      id: 3,
      name: 'Toyota Camry',
      category: 'Sedan',
      image: '/placeholder-car.jpg',
      price: 180,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        year: 2024
      },
      features: ['Backup Camera', 'Cruise Control', 'USB Ports']
    },
    {
      id: 4,
      name: 'Range Rover Sport',
      category: 'Luxury SUV',
      image: '/placeholder-car.jpg',
      price: 520,
      specs: {
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['Premium Sound', 'Panoramic Roof', 'Massage Seats']
    },
    {
      id: 5,
      name: 'Tesla Model 3',
      category: 'Electric',
      image: '/placeholder-car.jpg',
      price: 280,
      specs: {
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric',
        year: 2024
      },
      features: ['Autopilot', 'Premium Interior', 'Fast Charging']
    },
    {
      id: 6,
      name: 'Nissan Patrol',
      category: 'SUV',
      image: '/placeholder-car.jpg',
      price: 320,
      specs: {
        seats: 8,
        transmission: 'Automatic',
        fuel: 'Petrol',
        year: 2024
      },
      features: ['4x4', 'Off-Road Package', 'Third Row Seats']
    }
  ]

  return (
    <Layout>
      <div className='py-16'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
            Featured Cars
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Explore our premium collection of vehicles available for rent
          </p>
        </div>

        {/* Cars Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {cars.map((car) => (
            <div
              key={car.id}
              className='group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'
            >
              {/* Category Badge */}
              <div className='absolute top-4 right-4 z-10 bg-linear-to-r from-primary to-primary-light text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg'>
                {car.category}
              </div>

              {/* Image Container */}
              <div className='relative h-56 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden'>
                {/* Placeholder for car image */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
              </div>

              {/* Content */}
              <div className='p-6'>
                {/* Car Name */}
                <h3 className='text-2xl font-bold text-[#000000] mb-2 group-hover:text-primary transition-colors'>
                  {car.name}
                </h3>

                {/* Specs Grid */}
                <div className='grid grid-cols-2 gap-3 mb-4 py-4 border-t border-b border-gray-200'>
                  <div className='flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className='text-sm text-[#333333]'>{car.specs.seats} Seats</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className='text-sm text-[#333333]'>{car.specs.transmission}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className='text-sm text-[#333333]'>{car.specs.fuel}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className='text-sm text-[#333333]'>{car.specs.year}</span>
                  </div>
                </div>

                {/* Features */}
                <div className='mb-4'>
                  <div className='flex flex-wrap gap-2'>
                    {car.features.map((feature, index) => (
                      <span
                        key={index}
                        className='text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full'
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                  <div>
                    <p className='text-sm text-gray-500'>Per Day</p>
                    <p className='text-3xl font-bold text-primary'>
                      ${car.price}
                    </p>
                  </div>
                  <button className='px-6 py-3 bg-linear-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50'>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className='mt-12 text-center'>
          <button className='px-8 py-4 bg-white hover:bg-primary text-primary hover:text-white border-2 border-primary font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg'>
            View All Cars
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default FeaturedCars
