import Layout from './Layout'

const HowToBook = () => {
  const steps = [
    {
      step: '01',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Search & Select',
      description: 'Choose your pickup location, dates, and browse through our wide selection of vehicles.'
    },
    {
      step: '02',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Fill Details',
      description: 'Provide your personal information and any additional requirements for your booking.'
    },
    {
      step: '03',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Make Payment',
      description: 'Complete your booking with our secure payment system. Multiple payment options available.'
    },
    {
      step: '04',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Get Confirmation',
      description: 'Receive instant confirmation via email and SMS with all your booking details.'
    }
  ]

  return (
    <Layout>
      <div className='py-16'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
            How to Book Your Car
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Follow these simple steps to book your perfect vehicle in minutes
          </p>
        </div>

        {/* Steps Container */}
        <div className='relative'>
          {/* Connection Line - Hidden on mobile */}
          <div className='hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto' style={{ width: 'calc(100% - 200px)', left: '100px' }}></div>

          {/* Steps Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10'>
            {steps.map((step, index) => (
              <div
                key={index}
                className='group relative flex flex-col items-center text-center'
              >
                {/* Step Number Badge */}
                <div className='absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform z-20'>
                  {step.step}
                </div>

                {/* Card */}
                <div className='w-full bg-white hover:bg-primary border-2 border-primary hover:border-primary-light rounded-2xl p-6 pt-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'>
                  {/* Icon */}
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light group-hover:from-white group-hover:to-white text-white group-hover:text-primary rounded-full mb-4 transition-all shadow-lg'>
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className='text-xl font-bold text-[#000000] group-hover:text-[#FFFFFF] mb-3 transition-colors'>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className='text-[#333333] group-hover:text-[#EEEEEE] text-sm leading-relaxed transition-colors'>
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop - Hidden on last item */}
                {index < steps.length - 1 && (
                  <div className='hidden lg:block absolute top-20 -right-8 text-primary'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className='mt-16 text-center'>
          <button className='px-8 py-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl'>
            Start Booking Now
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default HowToBook
