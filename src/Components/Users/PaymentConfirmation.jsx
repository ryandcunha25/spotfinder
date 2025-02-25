import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentConfirmation = () => {
  const location = useLocation();
  const { book_id, eventName, specialRequests } = location.state;

  const [bookedVenue, setBookedVenue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/bookings/confirmed-booking?book_id=${book_id}`);
        setBookedVenue(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Unable to fetch bookings');
      }
    };
    fetchBookings();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!bookedVenue) {
    return <div className="text-center text-gray-600 text-lg">Loading your venue booking receipt...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Booked Venue Receipt</h1>

        {/* Booking Reference */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
          <p className="text-gray-700 text-lg font-semibold">Reference ID:
          <span className="text-gray-900 font-bold text-xl"> {bookedVenue.booking_id}</span>
          </p>
        </div>

        {/* Main Grid Layout - Two Sections Per Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">User Details</h2>
            <div className="space-y-2 text-gray-800">
              <p><span className="font-semibold">Name:</span> {bookedVenue.first_name} {bookedVenue.last_name}</p>
              <p><span className="font-semibold">Email:</span> {bookedVenue.email}</p>
              <p><span className="font-semibold">Phone:</span> {bookedVenue.phone}</p>
            </div>
          </div>

          {/* Venue Details */}
          <div className="bg-green-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-green-900 mb-3">Venue Details</h2>
            <div className="space-y-2 text-gray-800">
              <p><span className="font-semibold">Venue:</span> {bookedVenue.name}</p>
              <p><span className="font-semibold">Capacity:</span> {bookedVenue.capacity} Guests</p>
              <p><span className="font-semibold">Price:</span> ${bookedVenue.price}</p>
              <p><span className="font-semibold">Ratings:</span> {bookedVenue.ratings} Stars</p>
              <p><span className="font-semibold">Location:</span> {bookedVenue.location}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-yellow-900 mb-3">Booking Details</h2>
            <div className="space-y-2 text-gray-800">
              <p><span className="font-semibold">Date:</span> {new Date(bookedVenue.booking_date).toLocaleDateString()}</p>
              <p><span className="font-semibold">Time:</span> {bookedVenue.start_time} - {bookedVenue.end_time}</p>
              <p><span className="font-semibold">Event Name:</span> {bookedVenue.event_name}</p>
              <p><span className="font-semibold">Event Type:</span> {bookedVenue.event_type}</p>
              <p><span className="font-semibold">Guest Count:</span> {bookedVenue.guest_count}</p>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-purple-900 mb-3">Additional Services</h2>
            <div className="space-y-2 text-gray-800">
              <p><span className="font-semibold">Catering:</span> {bookedVenue.catering ? "Included" : "Not Included"}</p>
              <p><span className="font-semibold">A/V Equipment:</span> {bookedVenue.avEquipment ? "Included" : "Not Included"}</p>
              <p><span className="font-semibold">Special Requests:</span> {bookedVenue.special_requests || "None"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden During Print) */}
        <div className="no-print text-center mt-6 flex justify-center gap-4">
          <Link to="/bookings" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg">
            View All Bookings
          </Link>
          <Link to="/" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg">
            Return to Home
          </Link>
          <button 
            onClick={handlePrint} 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
