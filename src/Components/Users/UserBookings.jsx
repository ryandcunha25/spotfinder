import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('User is not authenticated');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/bookings/show-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Bookings:', response.data);
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Unable to fetch bookings');
      }
    };

    fetchBookings();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center mt-4">No bookings found.</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-10">
      {bookings.map((booking) => {
        const bookingDate = new Date(booking.booking_date);
        const today = new Date();
        const isPastEvent = bookingDate < today;

        return (
          <div
            key={booking.booking_id}
            className="flex md:flex-row flex-col items-center bg-blue-50 border border-gray-300 pl-20 rounded-lg shadow w-3/4 md:w-3/4 max-w-4xl hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            {/* Venue Image */}
            <img
              className="object-cover w-40 h-40 rounded-xl md:rounded-none md:rounded-lg"
              src={require(`./../Assets/${booking.image[0]}`)}
              alt={booking.venue_name}
            />

            {/* Booking Details */}
            <div className="flex-1 flex flex-col justify-between pl-10 py-4 leading-normal">
              <h5 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {booking.name}
              </h5>
              <p className="mb-3">
                <span className="font-semibold text-gray-800 dark:text-gray-200">Event Date: </span>
                <span className="text-gray-700 dark:text-gray-400">{bookingDate.toLocaleDateString()}</span>
              </p>
              <p className="mb-3">
                <span className="font-semibold text-gray-800 dark:text-gray-200">Time: </span>
                <span className="text-gray-700 dark:text-gray-400">{booking.start_time} - {booking.end_time}</span>
              </p>
              <p className="mb-3">
                <span className="font-semibold text-gray-800 dark:text-gray-200">Location: </span>
                <span className="text-gray-700 dark:text-gray-400">{booking.location}</span>
              </p>
            </div>

            {/* Buttons Section (Fixed Height & Alignment) */}
            <div className="flex flex-col space-y-4 min-w-[200px] mx-4 self-center mt-4 ml-12 mb-4 h-[130px] justify-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 focus:outline-none"
                onClick={() =>
                  navigate('/payment-confirmation', {
                    state: { book_id: booking.booking_id, eventName: booking.event_name },
                  })
                }
              >
                View Receipt
              </button>
              <button
                className="bg-yellow-500 text-white py-2 px-4 rounded w-full hover:bg-yellow-600 focus:outline-none"
                onClick={() => navigate(`/edit-booking/${booking.booking_id}`)}
              >
                Edit Booking
              </button>
              {!isPastEvent && (
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded w-full hover:bg-red-600 focus:outline-none"
                  onClick={() => navigate(`/cancel-booking/${booking.booking_id}`)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingsList;
