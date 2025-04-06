import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    ArrowPathIcon,
    ClockIcon,
    CurrencyDollarIcon,
    CreditCardIcon,
    CalendarIcon,
    ExclamationTriangleIcon,
    UserCircleIcon,
    BuildingOfficeIcon,
    TicketIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    TableCellsIcon,
    CalendarDaysIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import { format, parseISO, isSameDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import {message} from 'antd';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("table");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

    const openBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setIsDetailsModalOpen(true);
    };

    const openPaymentModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDetailsModalOpen(false);
        setSelectedBooking(null);
        setPaymentDetails(null);
    };

    const handleStatusChange = async (booking_id, user_id = null, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/bookings/update-booking-status/${booking_id}`, { status: newStatus });
            await axios.post("http://localhost:5000/notifications/add", {
                user_id,
                bookingId: booking_id,
                message: `Your booking status for booking id: #${booking_id} has been ${newStatus}.`,
                type: newStatus,
            });
            fetchBookings();
        } catch (error) {
            console.error("Error updating booking status:", error);
            message.error("An error occurred. Please try again.");
        }
    };

    const fetchPaymentDetails = async (booking) => {
        try {
            const response = await axios.get(`http://localhost:5000/razorpay/show-payment-details/${booking.booking_id}`);
            setPaymentDetails(response.data);
            setSelectedBooking(booking);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching payment details:", error);
            message.error("Failed to fetch payment details.");
        }
    };

    const initiateRefund = () => {
        setIsConfirmOpen(true);
    };

    const confirmRefund = async () => {
        if (!selectedBooking) {
            message.error("Error: No booking selected.");
            return;
        }

        try {
            const refundResponse = await axios.post(
                `http://localhost:5000/razorpay/refund/${paymentDetails.payment_id}`
            );

            if (refundResponse.status === 200) {
                message.success("Refund processed successfully!");
                await handleStatusChange(selectedBooking.booking_id, selectedBooking.user_id, "Refunded");
                setIsConfirmOpen(false);
                closeModal();
            } else {
                message.error("Refund failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing refund:", error);
            message.error("An error occurred. Please try again.");
        }
    };

    const cancelRefund = () => {
        setIsConfirmOpen(false);
    };

    const filteredBookings = bookings.filter(booking => {
        const statusMatch = filter === "all" ||
            booking.status.toLowerCase() === filter.toLowerCase();

        const searchMatch = searchQuery === "" ||
            booking.booking_id.toString().includes(searchQuery) ||
            `${booking.first_name} ${booking.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && searchMatch;
    });

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center";

        switch (status.toLowerCase()) {
            case "pending":
                return (
                    <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {status}
                    </span>
                );
            case "accepted":
                return (
                    <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        {status}
                    </span>
                );
            case "success":
                return (
                    <span className={`${baseClasses} bg-green-100 text-green-800`}>
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        {status}
                    </span>
                );
            case "cancelled":
            case "canceled":
                return (
                    <span className={`${baseClasses} bg-red-100 text-red-800`}>
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        {status}
                    </span>
                );
            case "refunded":
                return (
                    <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
                        <ArrowPathIcon className="h-3 w-3 mr-1" />
                        {status}
                    </span>
                );
            default:
                return (
                    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
                        {status}
                    </span>
                );
        }
    };

    // Calendar View Functions
    const getCalendarDays = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    const getBookingsForDay = (day) => {
        return filteredBookings.filter(booking => {
            const bookingDate = parseISO(booking.booking_date);
            return isSameDay(bookingDate, day);
        });
    };

    const nextMonth = () => {
        setCurrentMonth(addDays(currentMonth, 32));
    };

    const prevMonth = () => {
        setCurrentMonth(addDays(currentMonth, -32));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="ml-64 flex-1 pr-8 overflow-x-hidden">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
                            <p className="text-gray-500">View and manage all venue bookings</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="all">All Bookings</option>
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="success">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex">
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={`px-3 py-2 rounded-l-lg border ${viewMode === "table" ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                                    title="Table View"
                                >
                                    <TableCellsIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("calendar")}
                                    className={`px-3 py-2 rounded-r-lg border ${viewMode === "calendar" ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                                    title="Calendar View"
                                >
                                    <CalendarDaysIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4">
                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
                                <TicketIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <p className="text-xl font-semibold">{bookings.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
                        <div className="flex items-center">
                            <div className="p-2 rounded-full bg-amber-100 text-amber-500 mr-3">
                                <ClockIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-xl font-semibold">
                                    {bookings.filter(b => b.status.toLowerCase() === "pending").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-2 rounded-full bg-green-100 text-green-500 mr-3">
                                <CheckCircleIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Completed</p>
                                <p className="text-xl font-semibold">
                                    {bookings.filter(b => b.status.toLowerCase() === "success").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
                        <div className="flex items-center">
                            <div className="p-2 rounded-full bg-red-100 text-red-500 mr-3">
                                <XCircleIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Cancelled</p>
                                <p className="text-xl font-semibold">
                                    {bookings.filter(b =>
                                        b.status.toLowerCase() === "cancelled" ||
                                        b.status.toLowerCase() === "canceled"
                                    ).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {viewMode === "table" ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden min-w-fit">
                        <table className="divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Booking
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Venue
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                        <TicketIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                                                            onClick={() => openBookingDetails(booking)}
                                                        >
                                                            #{booking.booking_id}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.event_name || "No event name"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                        {booking.first_name.charAt(0)}{booking.last_name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.first_name} {booking.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <BuildingOfficeIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Capacity: {booking.capacity}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                                                        {new Date(booking.booking_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                                                        {booking.start_time} - {booking.end_time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {booking.status === "Pending" && (
                                                        <button
                                                            onClick={() => handleStatusChange(booking.booking_id, booking.user_id, "Accepted")}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                            Accept
                                                        </button>
                                                    )}
                                                    {booking.status !== "Cancelled" &&
                                                        booking.status !== "Canceled" &&
                                                        booking.status !== "Refunded" && (
                                                            <button
                                                                onClick={() => handleStatusChange(booking.booking_id, booking.user_id, "Cancelled")}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                <XCircleIcon className="h-3 w-3 mr-1" />
                                                                Cancel
                                                            </button>
                                                        )}
                                                    {booking.status === "Success" && (
                                                        <button
                                                            onClick={() => fetchPaymentDetails(booking)}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            <EyeIcon className="h-3 w-3 mr-1" />
                                                            Details
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <TicketIcon className="h-12 w-12 text-gray-400" />
                                                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {searchQuery ?
                                                        "Try adjusting your search or filter criteria" :
                                                        "There are currently no bookings matching your criteria"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full mx-auto">
                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={prevMonth} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                            </button>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {format(currentMonth, "MMMM yyyy")}
                            </h2>
                            <button onClick={nextMonth} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {getCalendarDays().map((day, index) => {
                                const dayBookings = getBookingsForDay(day);
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isTodayDate = isToday(day);

                                return (
                                    <div
                                        key={index}
                                        className={`relative min-h-24 p-2 rounded-lg border shadow-sm transition-all
                      ${isCurrentMonth ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-400'}
                      ${isTodayDate ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}
                      hover:bg-gray-50`}
                                    >
                                        <div className={`text-right p-1 rounded-full w-8 h-8 flex items-center justify-center ml-auto 
                      ${isTodayDate ? 'bg-blue-500 text-white font-bold' : ''}`}>
                                            {format(day, "d")}
                                        </div>

                                        {/* Bookings */}
                                        <div className="space-y-1 max-h-20 overflow-y-auto mt-1">
                                            {dayBookings.map(booking => (
                                                <div
                                                    key={booking.id}
                                                    className="text-xs p-1.5 bg-blue-100 rounded-md truncate cursor-pointer hover:bg-blue-200 transition"
                                                    onClick={() => openBookingDetails(booking)}
                                                >
                                                    <div className="font-medium truncate text-blue-800">{booking.name}</div>
                                                    <div className="text-xs text-blue-600 truncate">
                                                        {format(new Date(`2000-01-01T${booking.start_time}`), 'h:mm a')} - {format(new Date(`2000-01-01T${booking.end_time}`), 'h:mm a')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Booking Details Modal */}
                {isDetailsModalOpen && selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all duration-200 ease-in-out max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <XCircleIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                <TicketIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Booking ID</p>
                                                <p className="font-medium text-gray-900">#{selectedBooking.booking_id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                <UserCircleIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Customer</p>
                                                <p className="font-medium text-gray-900">
                                                    {selectedBooking.first_name} {selectedBooking.last_name}
                                                </p>
                                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                                                    {selectedBooking.email}
                                                </div>
                                                {selectedBooking.phone && (
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <PhoneIcon className="h-4 w-4 mr-1" />
                                                        {selectedBooking.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                                <BuildingOfficeIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Venue</p>
                                                <p className="font-medium text-gray-900">{selectedBooking.name}</p>
                                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                                    {selectedBooking.location}
                                                </div>
                                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                                    <UsersIcon className="h-4 w-4 mr-1" />
                                                    Capacity: {selectedBooking.capacity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                                                <CalendarIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Event Date & Time</p>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(selectedBooking.booking_date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {selectedBooking.start_time} - {selectedBooking.end_time}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <TicketIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Event Name</p>
                                                <p className="font-medium text-gray-900">
                                                    {selectedBooking.event_name || "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                                <TicketIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Event Type</p>
                                                <p className="font-medium text-gray-900">
                                                    {selectedBooking.event_type || "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                                                {selectedBooking.status === 'Success' ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                ) : selectedBooking.status === 'Pending' ? (
                                                    <ClockIcon className="h-5 w-5 text-amber-500" />
                                                ) : (
                                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <p className={`font-medium ${selectedBooking.status === 'Success' ? 'text-green-600' :
                                                    selectedBooking.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                                                    }`}>
                                                    {selectedBooking.status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Services Section */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                                            <CheckCircleIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Catering</p>
                                            <p className="font-medium text-gray-900">
                                                {selectedBooking.catering ? "Requested" : "Not Requested"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                            <CheckCircleIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">AV Equipment</p>
                                            <p className="font-medium text-gray-900">
                                                {selectedBooking.avEquipment ? "Requested" : "Not Requested"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                                            <CheckCircleIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Decoration</p>
                                            <p className="font-medium text-gray-900">
                                                {selectedBooking.decoration ? "Requested" : "Not Requested"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                            <CheckCircleIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Stage Setup</p>
                                            <p className="font-medium text-gray-900">
                                                {selectedBooking.stageSetup ? "Requested" : "Not Requested"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Full-width Special Request Section */}
                                {selectedBooking.special_requests && (
                                    <div className="mt-6">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                    <ExclamationTriangleIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Special Request</p>
                                                    <p className="text-gray-600 whitespace-pre-wrap">
                                                        {selectedBooking.special_requests}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end space-x-3">
                                    {/* <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button> */}
                                    {selectedBooking.status === "Success" && (
                                        <button
                                            onClick={() => {
                                                closeModal();
                                                fetchPaymentDetails(selectedBooking);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View Payment Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Details Modal */}
                {isModalOpen && paymentDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200 ease-in-out">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <XCircleIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                            <CreditCardIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Transaction ID</p>
                                            <p className="font-medium text-gray-900">{paymentDetails.payment_id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                            <CurrencyDollarIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Amount</p>
                                            <p className="font-medium text-green-600">₹{paymentDetails.amount}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                                            <ArrowPathIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Method</p>
                                            <p className="font-medium text-gray-900">{paymentDetails.payment_method}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                            <CalendarIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date of Payment</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(paymentDetails.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                                            {paymentDetails.payment_status === 'Success' ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            ) : paymentDetails.payment_status === 'Pending' ? (
                                                <ClockIcon className="h-5 w-5 text-amber-500" />
                                            ) : (
                                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <p className={`font-medium ${paymentDetails.payment_status === 'Success' ? 'text-green-600' :
                                                paymentDetails.payment_status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                {paymentDetails.payment_status}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={initiateRefund}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                    >
                                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                                        Process Refund
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Refund Confirmation Modal */}
                {isConfirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200 ease-in-out">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Confirm Refund</h2>
                                    <button
                                        onClick={cancelRefund}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <XCircleIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="text-center py-4">
                                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
                                    <h3 className="mt-3 text-lg font-medium text-gray-900">Are you sure?</h3>
                                    <p className="mt-2 text-gray-700">
                                        You're about to refund <span className="font-bold">₹{paymentDetails?.amount}</span> to the customer.
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        This action cannot be undone.
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={cancelRefund}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmRefund}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Confirm Refund
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;