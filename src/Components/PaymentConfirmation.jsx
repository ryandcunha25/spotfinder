import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentConfirmation = () => {
  const location = useLocation();
  const { bookingDetails } = location.state;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-1/2 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Payment Receipt</h1>
        
        <div className=" grid grid-cols-3 border-b border-gray-300 pb-4 mb-6">
          <p className="text-gray-600 text-sm">Reference ID:
          <span className="text-gray-800 font-medium"> {Date.now()}</span>
          </p>
          <p className="text-gray-600 text-sm">User:
          <span className="text-gray-800 font-medium"> {bookingDetails.name}</span>
          </p>
          <p className="text-gray-600 text-sm">Email:
          <span className="text-gray-800 font-medium"> {bookingDetails.email}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pl-[15%]">
          <div>
            <p className="text-gray-600 text-sm">Venue:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Capacity:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.capacity} Guests</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Price:</p>
            <p className="text-gray-800 font-medium">${bookingDetails.price}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Ratings:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.ratings} Stars</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Date:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.date}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Time:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.time}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Event Name:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.eventName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Event Type:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.eventType}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Guest Count:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.guestCount}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Catering:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.catering ? "Included" : "Not Included"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">A/V Equipment:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.avEquipment ? "Included" : "Not Included"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Special Requests:</p>
            <p className="text-gray-800 font-medium">{bookingDetails.specialRequests || "None"}</p>
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
























































































