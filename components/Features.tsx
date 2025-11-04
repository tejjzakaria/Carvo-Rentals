import Layout from './Layout'

const Features = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '24/7 Availability',
      description: 'Book your car anytime, anywhere with our round-the-clock service and support.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Vehicles',
      description: 'All our vehicles are thoroughly inspected and maintained to ensure safety and reliability.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Best Prices',
      description: 'Competitive rates with no hidden fees. Get the best value for your money.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Multiple Locations',
      description: 'Pick up and drop off at convenient locations across Morocco.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Professional Drivers',
      description: 'Experienced and licensed drivers available for your convenience and comfort.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Instant Booking',
      description: 'Quick and easy booking process. Get your car in just a few clicks.'
    }
  ]

  return (
    <Layout>
      <div className='py-16'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
            Why Choose Carvo?
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Experience the best car rental service with our premium features and exceptional customer support
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group relative bg-white hover:bg-primary border border-gray-200 hover:border-primary-light rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
            >
              {/* Content */}
              <div className='relative z-10'>
                {/* Icon */}
                <div className='inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary to-primary-light group-hover:from-secondary group-hover:to-secondary-light text-white rounded-xl mb-4 group-hover:scale-110 transition-all shadow-lg'>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className='text-xl font-bold text-[#000000] group-hover:text-[#FFFFFF] mb-3 transition-colors'>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className='text-[#333333] group-hover:text-[#EEEEEE] leading-relaxed transition-colors'>
                  {feature.description}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className='absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-accent/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Features
