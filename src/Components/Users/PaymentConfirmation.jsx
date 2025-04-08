import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentConfirmation = () => {
  const location = useLocation();
  const { book_id, eventName, specialRequests } = location.state;

  const [bookedVenue, setBookedVenue] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://84fa-115-98-235-107.ngrok-free.app/bookings/confirmed-booking?book_id=${book_id}`);
        setBookedVenue(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Unable to fetch booking details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [book_id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Booking</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/bookings"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (!bookedVenue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-medium text-gray-800 mt-4">No Booking Details Found</h2>
          <p className="text-gray-600 mt-2">We couldn't retrieve your booking information.</p>
        </div>
      </div>
    );
  }

  // Format date with day name
  const bookingDate = new Date(bookedVenue.booking_date);
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Booking Confirmation</h1>
          <p className="text-base sm:text-lg text-gray-600">Your venue has been booked!</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-xl overflow-hidden">
          {/* Confirmation Banner */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white text-center">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl sm:text-2xl font-bold">Booking Successful!</h2>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Reference ID */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Booking Reference ID</h3>
                <p className="text-lg sm:text-xl font-bold text-gray-800">{bookedVenue.booking_id}</p>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Booking Date</h3>
                <p className="text-base sm:text-lg font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="w-full sm:w-auto flex justify-end sm:justify-center">
                <img
                  src={require(`./../Assets/logo.png`)}
                  alt="Company Logo"
                  className="h-12 sm:h-16 w-auto" 
                />
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* User Details */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-5">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-blue-100 p-1 sm:p-2 rounded-full mr-2 sm:mr-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Customer Information</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.first_name} {bookedVenue.last_name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.email}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.phone}</p>
                  </div>
                </div>
              </div>

              {/* Venue Details */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-5">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-green-100 p-1 sm:p-2 rounded-full mr-2 sm:mr-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Venue Details</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Venue Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Location</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Capacity</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.capacity} guests</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Price Breakdown</p>
                      <div className="text-sm sm:text-base font-medium text-gray-800 flex flex-wrap items-center gap-1">
                        <div className="flex items-center">
                          <span className="text-sm sm:text-base">₹</span>
                          {bookedVenue.price}
                        </div>
                        <span className="mx-1">+</span>
                        <div className="flex items-center text-gray-500">
                          <span className="text-sm sm:text-base">₹</span>
                          {bookedVenue.total_price - bookedVenue.price}
                          <span className="ml-1 text-xs">fee</span>
                        </div>
                        <span className="mx-1">=</span>
                        <div className="flex items-center text-green-600 font-semibold">
                          <span className="text-sm sm:text-base">₹</span>
                          {bookedVenue.total_price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-5">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-purple-100 p-1 sm:p-2 rounded-full mr-2 sm:mr-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Event Details</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Event Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.event_name}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Event Date</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{formattedDate}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Time</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">{bookedVenue.start_time} - {bookedVenue.end_time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-5">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="bg-yellow-100 p-1 sm:p-2 rounded-full mr-2 sm:mr-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Additional Services</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Catering</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {bookedVenue.catering ? (
                          <span className="text-green-600">Included</span>
                        ) : (
                          <span className="text-red-500">Not included</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">A/V Equipment</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {bookedVenue.avEquipment ? (
                          <span className="text-green-600">Included</span>
                        ) : (
                          <span className="text-red-500">Not included</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Decoration</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {bookedVenue.decoration ? (
                          <span className="text-green-600">Included</span>
                        ) : (
                          <span className="text-red-500">Not included</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Stage Setup</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {bookedVenue.stageSetup ? (
                          <span className="text-green-600">Included</span>
                        ) : (
                          <span className="text-red-500">Not included</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Special Requests</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800 whitespace-pre-wrap">
                      {bookedVenue.special_requests || "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-1 sm:mb-2">Thank you for your booking!</h3>
              <p className="text-sm sm:text-base text-blue-700">Please present this receipt as a confirmation at the venue.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors shadow-md"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Confirmation
          </button>
          <Link
            to="/bookings"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors shadow-md"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View All Bookings
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white text-sm sm:text-base font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors shadow-md"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;