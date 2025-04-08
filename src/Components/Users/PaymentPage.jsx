import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {message} from 'antd';


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

  // Function to render stars with decimal precision
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const decimalPart = rating % 1;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  
    // Half star (if needed)
    if (decimalPart > 0) {
      stars.push(
        <div key="half" className="relative w-5 h-5">
          <svg
            className="w-5 h-5 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
          <div className="absolute top-0 left-0 w-5 h-5 overflow-hidden" style={{ width: `${decimalPart * 100}%` }}>
            <svg
              className="w-5 h-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      );
    }
  
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  
    return stars;
  };


  const handlePayment = async () => {
    try {
      const response = await fetch('https://84fa-115-98-235-107.ngrok-free.app/razorpay/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: bookingDetails.total_price, currency: 'INR' }),
      });

      const order = await response.json();
      const options = {
        key: "rzp_test_Sq03R0iqsY5YcR",
        amount: order.amount,
        currency: order.currency,
        name: 'SpotFinder',
        description: 'Payment for venue reservation',
        order_id: order.id,
        handler: async (response) => {
          const verifyResponse = await fetch('https://84fa-115-98-235-107.ngrok-free.app/razorpay/verify-payment', {
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
                `https://84fa-115-98-235-107.ngrok-free.app/bookings/update-booking-status/${booking_id}`,
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
                message.success('Payment successful! Booking confirmed.');
                navigate('/payment-confirmation', {
                  state: { book_id: booking_id, eventName: bookingDetails.eventName },
                });
              } else {
                alert('Payment successful, but booking update failed.');
              }
            } catch (error) {
              message.error('An error occurred while updating booking status.');
            }
          } else {
            message.error('Payment verification failed.');
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

        {/* Ratings - Updated to use the renderStars function */}
        <div className="flex items-center mb-4">
          <div className="flex space-x-1">
            {renderStars(bookingDetails.ratings)}
          </div>
          <span className="ml-2 text-gray-600 text-sm font-semibold">{bookingDetails.ratings}</span>
        </div>

        {/* Price & Payment Button */}
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-gray-900">
            ₹{bookingDetails.total_price}
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