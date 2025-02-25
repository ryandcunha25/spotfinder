import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return <p className="text-center text-red-500 font-semibold mt-10">Error: No booking details found.</p>;
  }

  const booking_id = bookingDetails.booking_id;

  const formattedDate = new Date(bookingDetails.booking_date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });


  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/razorpay/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: bookingDetails.price, currency: 'INR' }),
      });

      const order = await response.json();
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Venue Booking',
        description: 'Payment for venue reservation',
        order_id: order.id,
        handler: async (response) => {
          const verifyResponse = await fetch('http://localhost:5000/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: bookingDetails,
            }),
          });

          const result = await verifyResponse.json();
          if (result.paymentDetails.payment_status === 'Success') {
            try {
              const updateResponse = await fetch(
                `http://localhost:5000/bookings/update-booking-status/${booking_id}`,
                {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bookingId: bookingDetails.booking_id,
                    paymentMethod: result.paymentDetails.payment_method,
                    status: 'Success',
                  }),
                }
              );

              if (updateResponse.ok) {
                alert('Payment successful! Booking confirmed.');
                navigate('/payment-confirmation', {
                  state: { book_id: booking_id, eventName: bookingDetails.eventName },
                });
              } else {
                alert('Payment successful, but booking update failed.');
              }
            } catch (error) {
              alert('An error occurred while updating booking status.');
            }
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: bookingDetails.first_name + " " + bookingDetails.last_name,
          email: bookingDetails.email,
          contact: bookingDetails.phone,
        },
        theme: { color: '#007bff' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        {/* Booking Image */}
        <img
          className="rounded-lg w-full h-52 object-cover mb-4"
          src={require(`./../Assets/${bookingDetails.image[0]}`)}
          alt={bookingDetails.name}
        />

        {/* Booking Details */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{bookingDetails.name}</h2>
        <p className="text-gray-600 text-sm mb-4">
          Date: <span className="font-semibold">
            {formattedDate}</span> | Time: <span className="font-semibold">{bookingDetails.start_time} - {bookingDetails.end_time}
          </span>
        </p>

        {/* Ratings */}
        <div className="flex items-center mb-4">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < bookingDetails.ratings ? "text-yellow-400" : "text-gray-300"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-600 text-sm font-semibold">{bookingDetails.ratings}</span>
        </div>

        {/* Price & Payment Button */}
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-gray-900">
            ₹{bookingDetails.price}
          </span>
          <button
            className="px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-lg transition duration-200 ease-in-out focus:outline-none"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
