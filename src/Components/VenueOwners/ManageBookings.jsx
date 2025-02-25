import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const ownerId = localStorage.getItem("ownerId");
        try {
            const response = await axios.get(`http://localhost:5000/bookings/showallbookings/${ownerId}`);
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (booking_id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/bookings/update-booking-status/${booking_id}`, { status: newStatus });
            fetchBookings(); // Refresh bookings after update
        } catch (error) {
            console.error("Error updating booking status:", error);
        }
    };

    if (loading) {
        return <div className="text-center text-xl mt-10">Loading bookings...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>
                <table className="w-full border-collapse border border-gray-300 text-left">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Booking ID</th>
                            <th className="p-2 border">Customer</th>
                            <th className="p-2 border">Venue</th>
                            <th className="p-2 border">Date & Time</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Payment</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border">
                                <td className="p-2 border">{booking.booking_id}</td>
                                <td className="p-2 border">
                                    {booking.first_name} {booking.last_name} ({booking.email})
                                </td>
                                <td className="p-2 border">{booking.name}</td>
                                <td className="p-2 border justify-center">
                                    {new Date(booking.booking_date).toLocaleDateString()} <br /> ({booking.start_time} - {booking.end_time})
                                </td>
                                <td className="p-2 border">
                                    <span
                                        className={`px-2 py-1 rounded-lg text-white ${
                                            booking.status === "Pending"
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
                                <td className="p-2 border">{booking.payment_method}</td>
                                <td className="p-2 border">
                                    {booking.status === "Pending" && (
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                            onClick={() => handleStatusChange(booking.booking_id, "Accepted")}
                                        >
                                            Accept
                                        </button>
                                    )}
                                    {booking.status !== "Cancelled" && (
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 mt-1 rounded"
                                            onClick={() => handleStatusChange(booking.booking_id, "Cancelled")}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;
