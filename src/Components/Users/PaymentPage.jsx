import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails } = location.state;
    console.log(bookingDetails)

    const handlePayment = async () => {
        console.log(typeof (window.Razorpay))
        
        try {
            const response = await fetch('http://localhost:5000/razorpay/create-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: bookingDetails.price, currency: 'INR' }),
            });

            const order = await response.json();
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Event Booking',
                description: 'Payment for venue booking',
                order_id: order.id,
                handler: async (response) => {
                    const verifyResponse = await fetch('http://localhost:5000/razorpay/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingDetails: bookingDetails,
                           
                        }),
                    }); {

                    }
                    
                    const result = await verifyResponse.json();
                    console.log(result)
                    if (result.paymentDetails.payment_status === "Success") {
                        const paymentMethod = result.paymentDetails.payment_method;
                        console.log('Payment Method:', paymentMethod);
                        try {
                            const response = await fetch('http://localhost:5000/bookings/update-booking-status', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({bookingId:bookingDetails.bookingId,  paymentMethod: paymentMethod, }),
                            });
                            
                            const data = await response.json();
                            if (response.ok) {
                              console.log('Booking status updated:', data.booking);
                              alert('Payment successful! Booking status updated.');
                              navigate('/payment-confirmation', { state: { book_id: data.booking.booking_id, eventName:bookingDetails.eventName} });
                            } else {
                              console.error('Failed to update booking status:', data.error);
                              alert('Payment successful, but failed to update booking status.');
                            }
                          } catch (error) {
                            console.error('Error handling payment success:', error);
                            alert('An error occurred while updating booking status.');
                          }
                        
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    // Complete the payment using Razorpay’s test cards:
                    // Card Number: 4111 1111 1111 1111
                    // Expiry: Any future date
                    // CVV: 123
                    // OTP: Any 6 digits.  
                    name: 'User Name',
                    email: 'user@example.com',
                    contact: '1234567890',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto mt-10">
            <a href="#">
                <img
                    className="p-8 rounded-t-lg"
                    src={require(`./../Assets/${bookingDetails.image[0]}`)}
                    alt={bookingDetails.name}
                />
            </a>
            <div className="px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {bookingDetails.name}
                    </h5>
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Date: {bookingDetails.eventDate}     |    Time: {bookingDetails.startTime} - {bookingDetails.endTime}
                </p>
                <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < bookingDetails.ratings ? "text-yellow-300" : "text-gray-200"
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                                aria-hidden="true"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        ))}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                        {bookingDetails.ratings}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        <i class="fa fa-inr"></i> {bookingDetails.price}
                    </span>
                    <button
                        className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800"
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
