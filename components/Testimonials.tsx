import Layout from './Layout'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Casablanca, Morocco',
      rating: 5,
      comment: 'Amazing service! The car was in perfect condition and the booking process was so smooth. Highly recommend Carvo for anyone looking to rent a car.',
      image: '/placeholder-avatar.jpg',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'Mohammed Alami',
      location: 'Marrakech, Morocco',
      rating: 5,
      comment: 'Best car rental experience I\'ve ever had. Professional staff, great prices, and the car exceeded my expectations. Will definitely use again!',
      image: '/placeholder-avatar.jpg',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emily Chen',
      location: 'Rabat, Morocco',
      rating: 5,
      comment: 'The customer service was outstanding. They helped me find the perfect car for my family trip. Everything was transparent and hassle-free.',
      image: '/placeholder-avatar.jpg',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'Ahmed Hassan',
      location: 'Tangier, Morocco',
      rating: 5,
      comment: 'Excellent experience from start to finish. The car was spotless, fuel-efficient, and the return process was incredibly easy. Five stars!',
      image: '/placeholder-avatar.jpg',
      date: '1 week ago'
    },
    {
      id: 5,
      name: 'Lisa Martinez',
      location: 'Agadir, Morocco',
      rating: 5,
      comment: 'I rent cars frequently for business, and Carvo is by far the best. Reliable, affordable, and their premium selection is impressive.',
      image: '/placeholder-avatar.jpg',
      date: '2 months ago'
    },
    {
      id: 6,
      name: 'Khalid Mansour',
      location: 'Fes, Morocco',
      rating: 5,
      comment: 'Great value for money! The booking was instant, and I loved the flexibility with pickup locations. Definitely my go-to rental service now.',
      image: '/placeholder-avatar.jpg',
      date: '3 weeks ago'
    }
  ]

  return (
    <Layout>
      <div className='py-16'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4 text-primary'>
            What Our Customers Say
          </h2>
          <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
            Real experiences from real customers who trusted us with their journey
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className='group relative bg-white hover:bg-primary border-2 border-primary hover:border-primary-light rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2'
            >
              {/* Quote Icon */}
              <div className='absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-2.5 0-4.5 2-4.5 4.5S4 19 6.5 19c1.5 0 2.8-.8 3.5-2-.3 2.7-2.6 5-5.5 5H3v-2h1.5c2 0 3.5-1.5 3.5-3.5V16c-.6.6-1.5 1-2.5 1-2.5 0-4.5-2-4.5-4.5S4 8 6.5 8V10zm9 0c-2.5 0-4.5 2-4.5 4.5S13 19 15.5 19c1.5 0 2.8-.8 3.5-2-.3 2.7-2.6 5-5.5 5H12v-2h1.5c2 0 3.5-1.5 3.5-3.5V16c-.6.6-1.5 1-2.5 1-2.5 0-4.5-2-4.5-4.5S13 8 15.5 8V10z"/>
                </svg>
              </div>

              {/* Rating Stars */}
              <div className='flex gap-1 mb-4'>
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-accent group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className='text-[#333333] group-hover:text-[#EEEEEE] mb-6 leading-relaxed transition-colors relative z-10'>
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className='flex items-center gap-4 pt-4 border-t border-gray-200 group-hover:border-white/20 transition-colors'>
                {/* Avatar */}
                <div className='w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-light group-hover:from-white group-hover:to-white flex items-center justify-center text-white group-hover:text-primary font-bold text-lg shadow-lg transition-all'>
                  {testimonial.name.charAt(0)}
                </div>

                {/* Name and Location */}
                <div className='flex-1'>
                  <h4 className='font-bold text-[#000000] group-hover:text-[#FFFFFF] transition-colors'>
                    {testimonial.name}
                  </h4>
                  <p className='text-sm text-gray-500 group-hover:text-white/80 transition-colors'>
                    {testimonial.location}
                  </p>
                </div>

                {/* Date */}
                <div className='text-xs text-gray-400 group-hover:text-white/60 transition-colors'>
                  {testimonial.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-12 text-center'>
          <p className='text-gray-400 mb-4'>Have you rented with us? Share your experience!</p>
          <button className='px-8 py-3 bg-white hover:bg-primary text-primary hover:text-white border-2 border-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg'>
            Write a Review
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Testimonials
