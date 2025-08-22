import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingsList = () => {
  const [bookings, setBookings] = useState({
    pending: [],
    accepted: [],
    success: [],
    cancelled: []
  });
  const [visibleCount, setVisibleCount] = useState({
    pending: 3,
    accepted: 3,
    success: 3,
    cancelled: 3
  });
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const backendurl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        message.warning("Please log in to check your bookings");
        navigate("/");
        setError("Please login to view your bookings");
        setIsLoading(false);
        return;
      }

      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

      try {
        const response = await axios.get(`${backendurl}/bookings/show-bookings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)

        const categorizedBookings = {
          pending: response.data.filter(booking => booking.status === "Pending"),
          accepted: response.data.filter(booking => booking.status === "Accepted"),
          success: response.data.filter(booking => booking.status === "Success"),
          cancelled: response.data.filter(booking => booking.status === "Cancelled")
        };

        setBookings(categorizedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Unable to fetch bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
    if (expandedSection === section) {
      setVisibleCount(prev => ({ ...prev, [section]: 3 }));
    }
  };

  const showMoreBookings = (section) => {
    setVisibleCount(prev => ({ ...prev, [section]: prev[section] + 3 }));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: "bg-yellow-100 text-yellow-800",
      Accepted: "bg-blue-100 text-blue-800",
      Success: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800"
    };

    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const renderBookingCard = (booking) => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    const isPastEvent = bookingDate < today;
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <div
        key={booking.booking_id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-800">{booking.name}</h3>
            {getStatusBadge(booking.status)}
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{booking.location}</span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{booking.start_time} - {booking.end_time}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              {/* Base Price */}
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  Venue: <span className="font-medium">₹{booking.price}</span>
                </span>
              </div>

              {/* Additional Services */}
              {booking.total_price > booking.price && (
                <div className="flex items-center ml-6">
                  <svg className="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Services: <span className="font-medium">₹{booking.total_price - booking.price}</span>
                  </span>
                </div>
              )}

              {/* Total Price */}
              <div className="flex items-center pt-1 border-t border-gray-200 mt-1">
                <svg className="w-4 h-4 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium text-gray-900">
                  Total: ₹{booking.total_price ? booking.total_price : booking.price}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              {/* Only show receipt for Accepted and Cancelled bookings */}
              {(booking.status === "Success") && (
                <button
                  onClick={() => navigate("/payment-confirmation", { state: { book_id: booking.booking_id, eventName: booking.event_name } })}
                  className="px-3 py-1.5 text-sm bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-500 transition-colors flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Receipt
                </button>
              )}
              {/* 
              {!isPastEvent && booking.status !== "Cancelled" && (
                <>
                  <button
                    onClick={() => navigate(`/edit-booking/${booking.booking_id}`)}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    onClick={() => navigate(`/cancel-booking/${booking.booking_id}`)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Cancel
                  </button>
                </>
              )} */}

              {booking.status === "Accepted" && (
                <button
                  onClick={() => navigate("/payment", { state: { bookingDetails: booking } })}
                  className="px-3 py-1.5 text-sm bg-green-600 text-green-50 rounded-lg hover:bg-green-500 transition-colors flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Pay
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100">
          <img
            className="w-full h-32 object-cover"
            src={require(`./../Assets/${booking.image[0]}`)}
            alt={booking.venue_name}
          />
        </div>
      </div>
    );
  };

  const renderSection = (status, title) => {
    const isExpanded = expandedSection === status;
    const bookingsCount = bookings[status]?.length || 0;
    const visibleBookings = bookings[status]?.slice(0, visibleCount[status]) || [];

    if (bookingsCount === 0) return null;

    return (
      <div className="mb-6">
        <button
          onClick={() => toggleSection(status)}
          className={`w-full flex justify-between items-center p-4 rounded-lg transition-colors duration-200 ${isExpanded ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
        >
          <div className="flex items-center">
            <span className="font-bold text-lg">{title}</span>
            <span className="ml-3 bg-white text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {bookingsCount}
            </span>
          </div>
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleBookings.map(renderBookingCard)}
          </div>

          {bookingsCount > visibleCount[status] && (
            <div className="text-center mt-4">
              <button
                onClick={() => showMoreBookings(status)}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                Show more bookings
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Bookings</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasBookings = Object.values(bookings).some(section => section.length > 0);

  if (!hasBookings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 max-w-md text-center">
          <svg className="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start exploring venues to make your first booking!</p>
          <button
            onClick={() => navigate("/venues")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Bookings</h1>
          <p className="text-gray-600">Manage your upcoming and past event bookings</p>
        </div>

        <div className="space-y-6">
          {renderSection("pending", "Pending Approval")}
          {renderSection("accepted", "Accepted Bookings")}
          {renderSection("success", "Booked Venues")}
          {renderSection("cancelled", "Cancelled Bookings")}
        </div>
      </div>
    </div>
  );
};

export default BookingsList;