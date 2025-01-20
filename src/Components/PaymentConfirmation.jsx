import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentConfirmation = () => {

  const location = useLocation();
  const { book_id, eventName, eventType } = location.state;

  const [bookedVenue, setBookedVenue] = useState([]);
  const [error, setError] = useState(null);
  // const book_id = bookedVenue.bookingId;
  console.log(eventName)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/bookings/confirmed-booking?book_id=${book_id}`);
        console.log(response.data)
        setBookedVenue(response.data);
        console.log(bookedVenue)
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Unable to fetch bookings');
      }
    };

    fetchBookings();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (bookedVenue.length === 0) {
    return <div>Loading your venue booking reciept...</div>;
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-1/2 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Payment Receipt</h1>

        <div className=" grid grid-cols-3 border-b border-gray-300 pb-4 mb-6">
          <p className="text-gray-600 text-sm">Reference ID:
            <span className="text-gray-800 font-medium">{bookedVenue.booking_id} </span>
          </p>
          <p className="text-gray-600 text-sm">User:
            <span className="text-gray-800 font-medium"> {bookedVenue.first_name} {bookedVenue.last_name}</span>
          </p>
          <p className="text-gray-600 text-sm">Email:
            <span className="text-gray-800 font-medium"> {bookedVenue.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pl-[20%]">
          <div>
            <p className="text-gray-600 text-sm">Venue:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Capacity:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.capacity} Guests</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Price:</p>
            <p className="text-gray-800 font-medium">${bookedVenue.price}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Ratings:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.ratings} Stars</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Date:</p>
            <p className="text-gray-800 font-medium">
              {(() => {
                const date = new Date(bookedVenue.booking_date);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              })()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Time:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.start_time} -{bookedVenue.end_time}  </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Event Name:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.event_name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Event Type:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.event_type}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Guest Count:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.capacity}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Catering:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.catering ? "Included" : "Not Included"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">A/V Equipment:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.avEquipment ? "Included" : "Not Included"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Special Requests:</p>
            <p className="text-gray-800 font-medium">{bookedVenue.specialRequests || "None"}</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/bookings"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-2"
          >
            View All Bookings
          </Link>
          <br />
          <Link
            to="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
