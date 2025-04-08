import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaStar, FaCheck, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    eventType: '',
    capacity: '',
    priceRange: ''
  });
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch featured venues
    axios.get('https://84fa-115-98-235-107.ngrok-free.app/featured-venues')
      .then(response => setFeaturedVenues(response.data))
      .catch(error => console.error('Error fetching featured venues:', error));

    // Fetch testimonials
    axios.get('https://84fa-115-98-235-107.ngrok-free.app/testimonials')
      .then(response => setTestimonials(response.data))
      .catch(error => console.error('Error fetching testimonials:', error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/venues?search=${searchQuery}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center justify-center text-white"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1519671482749-fd09be7ccebf)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the Perfect Venue for Your Event!</h1>
          <p className="text-xl mb-8">Discover and book exceptional venues for any occasion</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition duration-300"
              onClick={() => navigate('/venues')}
            >
              Browse Venues
            </button>
            <button
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              onClick={() => navigate('/')}
            >
              Sign Up / Log In
            </button>
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Venues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredVenues && featuredVenues.length > 0 ? (
              featuredVenues.map(venue => (
                <div key={venue.venue_id} className="border border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div
                    className="h-64 bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url(${require(`./../Assets/${venue.image[0]}`)})` }}
                    onClick={() => navigate(`/venues/${venue.name}`)}
                  >
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{venue.ratings}</span> {/* ✅ Corrected `ratings` instead of `rating` */}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{venue.name}</h3>
                    <p className="text-gray-600 mb-3">{venue.location}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {venue.category.map((type, i) => ( // ✅ `category` instead of `eventTypes`
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">₹{venue.price}/day</span>
                      <button
                        className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition duration-300"
                        onClick={() => navigate(`/venues/${venue.name}`, { state: { venueId: venue.venue_id } })} // ✅ Corrected `venue.id` to `venue.venue_id`
                      >
                        View Details    
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading venues...</p> // ✅ Show fallback if `featuredVenues` is empty
            )}

          </div>
          <div className="text-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              onClick={() => navigate('/venues')}
            >
              View All Venues
            </button>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Range of Venues</h3>
              <p className="text-gray-600">From intimate spaces to grand ballrooms, we have venues for every event type and size.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Venue Owners</h3>
              <p className="text-gray-600">All our venue partners are thoroughly vetted to ensure quality and reliability.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Bookings & Payments</h3>
              <p className="text-gray-600">Our platform uses industry-standard encryption to protect all transactions.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Customer Support</h3>
              <p className="text-gray-600">Our dedicated team is always available to assist with any issues or questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Search & Select</h3>
              <p className="text-gray-600">Find the perfect venue using our powerful search tools and filters.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Send Booking Request</h3>
              <p className="text-gray-600">Submit your booking details and preferred dates to the venue owner.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Approval & Payment</h3>
              <p className="text-gray-600">The owner confirms availability and you complete the secure payment.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Event!</h3>
              <p className="text-gray-600">Show up on your event day and create wonderful memories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.review_id} className="bg-white p-8 rounded-lg shadow-md relative">
                <FaQuoteLeft className="text-blue-600 text-4xl opacity-20 absolute top-4 right-4" />
                <p className="italic mb-6">{testimonial.review_text}</p>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Owner CTA Section */}
      <section
        className="py-20 bg-cover bg-center text-white"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1558036117-15d82a90b9b1)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Are You a Venue Owner?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">List your venue on our platform and reach thousands of potential customers.</p>
          <ul className="text-left max-w-md mx-auto mb-8 space-y-2">
            <li className="flex items-start">
              <FaCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" />
              <span>Increase your venue's visibility</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" />
              <span>Manage bookings easily with our dashboard</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" />
              <span>Get paid securely and on time</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" />
              <span>Access to premium marketing tools</span>
            </li>
          </ul>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
            onClick={() => navigate('/venueownersregistration')}
          >
            Register as a Venue Owner
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <p className="mb-6">Our customer support team is available 24/7 to assist you.</p>
              <div className="space-y-3">
                <p><strong>Email:</strong> support@venuebooker.com</p>
                <p><strong>Phone:</strong> +1 (800) 123-4567</p>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#facebook" className="text-blue-600 hover:text-blue-800">Facebook</a>
                  <a href="#instagram" className="text-blue-600 hover:text-blue-800">Instagram</a>
                  <a href="#twitter" className="text-blue-600 hover:text-blue-800">Twitter</a>
                  <a href="#linkedin" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
                </div>
              </div>
            </div>
            <div>
              <form className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 w-full"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">SpotFinder</h3>
              <p className="text-gray-400">Your one-stop platform for finding and booking the perfect event venues.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="/venues" className="text-gray-400 hover:text-white transition">Browse Venues</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms-condition" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="/cancellation" className="text-gray-400 hover:text-white transition">Cancellation Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition">User Login</a></li>
                <li><a href="/signup" className="text-gray-400 hover:text-white transition">User Sign Up</a></li>
                <li><a href="/venueownerslogin" className="text-gray-400 hover:text-white transition">Venue Owner Login</a></li>
                <li><a href="/venueownersregistration" className="text-gray-400 hover:text-white transition">List Your Venue</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SpotFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;