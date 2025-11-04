import Layout from './Layout'

const FactsInNumbers = () => {
  const facts = [
    {
      number: '500+',
      label: 'Premium Vehicles',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'from-primary to-primary-light'
    },
    {
      number: '25K+',
      label: 'Happy Customers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-secondary to-secondary-light'
    },
    {
      number: '15+',
      label: 'Cities Covered',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-accent to-accent-light'
    },
    {
      number: '99.9%',
      label: 'Customer Satisfaction',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'from-primary to-secondary'
    }
  ]

  return (
    <div className='relative py-20 overflow-hidden'>
      {/* Background with gradient */}
      <div className='absolute inset-0 bg-linear-to-br from-primary via-primary-dark to-primary-light'></div>

      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl'></div>

      <Layout>
        <div className='relative z-10'>
          {/* Section Header */}
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Facts In Numbers
            </h2>
            <p className='text-lg text-white/80 max-w-2xl mx-auto'>
              Trusted by thousands of customers across Morocco
            </p>
          </div>

          {/* Facts Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {facts.map((fact, index) => (
              <div
                key={index}
                className='group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:-translate-y-2'
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-linear-to-br ${fact.color} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {fact.icon}
                </div>

                {/* Number */}
                <h3 className='text-5xl font-bold text-white group-hover:text-primary mb-2 transition-colors'>
                  {fact.number}
                </h3>

                {/* Label */}
                <p className='text-lg text-white/90 group-hover:text-primary font-medium transition-colors'>
                  {fact.label}
                </p>

                {/* Decorative corner */}
                <div className='absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
              </div>
            ))}
          </div>

          {/* Bottom decoration line */}
          <div className='mt-16 flex justify-center'>
            <div className='w-32 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent rounded-full'></div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default FactsInNumbers
