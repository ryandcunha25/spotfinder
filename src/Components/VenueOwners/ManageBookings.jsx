import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Bookings from "./Bookings";

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const openModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };


    const fetchBookings = async () => {
        const ownerId = localStorage.getItem("ownerId");
        try {
            const response = await axios.get(`http://localhost:5000/bookings/showallbookings/${ownerId}`);
            setBookings(response.data);
            console.log(response.data)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setLoading(false);
        }
    };
    const handleStatusChange = async (booking_id, user_id = null, newStatus) => {
        console.log("Processing status change for booking ID:", booking_id, "New status:", newStatus);
        try {
            // // If the status is "Cancelled", process the refund first
            // if (newStatus === "Cancelled") {
            //     const refundResponse = await axios.get(http://localhost:5000/razorpay/refund/${booking_id});
            //     console.log(refundResponse);
            //     if (refundResponse.status = 200) {
            //         alert("Refund processed successfully!");
            //         fetchBookings();    
            //     } else {
            //         alert("Refund failed. Cannot cancel booking.");
            //         return; // Stop execution if refund fails
            //     }
            // }

            // Update booking status after refund
            await axios.put(`http://localhost:5000/bookings/update-booking-status/${booking_id}`, { status: newStatus });
            await axios.post("http://localhost:5000/notifications/add", {
                user_id,
                bookingId: booking_id,
                message: `Your booking status for booking id: #${booking_id} has been ${newStatus}.`,
                type: newStatus,
            });
            // Refresh bookings after update
            fetchBookings();
        } catch (error) {
            console.error("Error processing refund or updating booking status:", error);
            alert("An error occurred. Please try again.");
        }
    };


    const fetchPaymentDetails = async (booking) => {
        try {
            const response = await axios.get(`http://localhost:5000/razorpay/show-payment-details/${booking.booking_id}`);
            setPaymentDetails(response.data);
            setSelectedBooking(booking); // Store the selected booking properly
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching payment details:", error);
            alert("Failed to fetch payment details.");
        }
    };


    const initiateRefund = () => {
        setIsConfirmOpen(true);
    };

    const confirmRefund = async () => {
        if (!selectedBooking) {
            alert("Error: No booking selected.");
            return;
        }

        console.log(selectedBooking.booking_id)
        try {
            const refundResponse = await axios.post(
                `http://localhost:5000/razorpay/refund/${paymentDetails.payment_id}`
            );

            if (refundResponse.status === 200) {
                alert("Refund processed successfully!");
                await handleStatusChange(selectedBooking.booking_id, selectedBooking.user_id, "Refunded");
                setIsConfirmOpen(false);
                closeModal();
            } else {
                alert("Refund failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing refund:", error);
            alert("An error occurred. Please try again.");
        }
    };



    const cancelRefund = () => {
        setIsConfirmOpen(false);
    };





    if (loading) {
        return <div className="text-center text-xl mt-10">Loading bookings...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar is fixed so it stays in place on scroll */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-64 p-10 bg-white shadow-xl rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Manage Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
                                <th className="p-3 border">Booking ID</th>
                                <th className="p-3 border">Customer</th>
                                <th className="p-3 border">Venue</th>
                                <th className="p-3 border">Date & Time</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border hover:bg-gray-50 transition duration-200">
                                    <td className="p-3 border text-center text-gray-600">{booking.booking_id}</td>
                                    <td className="p-3 border">
                                        <span className="font-semibold text-gray-700">
                                            {booking.first_name} {booking.last_name}
                                        </span>
                                        <br />
                                        <span className="text-sm text-gray-500">{booking.email}</span>
                                    </td>
                                    <td className="p-3 border text-gray-700">{booking.name}</td>
                                    <td className="p-3 border text-center text-gray-600">
                                        {new Date(booking.booking_date).toLocaleDateString()}
                                        <br />
                                        <span className="text-sm text-gray-500">
                                            ({booking.start_time} - {booking.end_time})
                                        </span>
                                    </td>
                                    <td className="p-3 border">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${booking.status === "Pending"
                                                ? "bg-yellow-500"
                                                : booking.status === "Accepted"
                                                    ? "bg-green-500"
                                                    : booking.status === "Success"
                                                        ? "bg-blue-500"
                                                        : booking.status === "Cancelled"
                                                            ? "bg-red-500"
                                                            : "bg-gray-500"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-3 border flex items-center space-x-2">
                                        {booking.status === "Pending" && (
                                            <button
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                                onClick={() => handleStatusChange(booking.booking_id, booking.user_id, "Accepted")}
                                            >
                                                Accept
                                            </button>
                                        )}
                                        {booking.status !== "Cancelled" &&
                                            booking.status !== "Canceled" &&
                                            booking.status !== "Refunded" && (
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                                    onClick={() => handleStatusChange(booking.booking_id, booking.user_id, "Cancelled")}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        {booking.status === "Success" && (
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                                onClick={() => fetchPaymentDetails(booking)} // Pass booking object
                                            >
                                                View Payment Details
                                            </button>

                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payment Details Modal */}
                {isModalOpen && paymentDetails && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
                        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full transform scale-95 animate-fadeIn transition-all duration-300">
                            <h2 className="text-3xl font-bold mb-5 text-gray-800 border-b pb-3 flex items-center justify-center">
                                Payment Details
                            </h2>
                            <div className="space-y-3">
                                <p className="text-lg text-gray-700 flex items-center">
                                    <span className="font-semibold">Transaction ID:</span>
                                    <span className="ml-2 text-gray-600">{paymentDetails.payment_id}</span>
                                </p>
                                <p className="text-lg text-gray-700 flex items-center">
                                    <span className="font-semibold">Payment Method:</span>
                                    <span className="ml-2 text-gray-600">{paymentDetails.payment_method}</span>
                                </p>
                                <p className="text-lg text-gray-700 flex items-center">
                                    <span className="font-semibold">Amount Paid:</span>
                                    <span className="ml-2 text-green-600 font-bold">₹{paymentDetails.amount}</span>
                                </p>
                                <p className="text-lg text-gray-700 flex items-center">
                                    <span className="font-semibold">Payment Status:</span>
                                    <span
                                        className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${paymentDetails.payment_status === 'Success'
                                                ? 'bg-green-500'
                                                : paymentDetails.payment_status === 'Pending'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                            }`}
                                    >
                                        {paymentDetails.payment_status}
                                    </span>
                                </p>
                                <p className="text-lg text-gray-700 flex items-center">
                                    <span className="font-semibold">Date of Payment:</span>
                                    <span className="ml-2 text-gray-600">
                                        {new Date(paymentDetails.created_at).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>
                            <div className="mt-6 flex justify-center space-x-4">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
                                    onClick={initiateRefund}
                                >
                                    Refund Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isConfirmOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
                        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full transform scale-95 animate-fadeIn transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Refund</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Are you sure you want to refund the payment of{' '}
                                <span className="font-bold text-green-600">₹{paymentDetails.amount}</span>?
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full transition duration-300"
                                    onClick={cancelRefund}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300"
                                    onClick={confirmRefund}
                                >
                                    Confirm Refund
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageBookings;