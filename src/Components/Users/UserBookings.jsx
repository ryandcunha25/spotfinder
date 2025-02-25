import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingsList = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]); // New state for Accepted bookings
  const [successBookings, setSuccessBookings] = useState([]);
  const [error, setError] = useState("");
  const [showPending, setShowPending] = useState(false);
  const [showAccepted, setShowAccepted] = useState(false); // Toggle state for Accepted
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/bookings/show-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Bookings:", response.data);

        const pending = response.data.filter((booking) => booking.status === "Pending");
        const accepted = response.data.filter((booking) => booking.status === "Accepted");
        const success = response.data.filter((booking) => booking.status === "Success");
        
        console.log(accepted)
        setPendingBookings(pending);
        setAcceptedBookings(accepted); // Store accepted bookings separately
        setSuccessBookings(success);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Unable to fetch bookings");
      }
    };

    fetchBookings();
  }, []);

  const renderBookings = (bookings) => (
    <div className="space-y-4 mt-4">
      {bookings.map((booking) => {
        const bookingDate = new Date(booking.booking_date);
        const today = new Date();
        const isPastEvent = bookingDate < today;

        return (
          <div
            key={booking.booking_id}
            className="flex md:flex-row flex-col items-center bg-blue-50 border border-gray-300 p-6 rounded-lg shadow w-full max-w-4xl hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <img
              className="object-cover w-40 h-40 rounded-xl md:rounded-none md:rounded-lg"
              src={require(`./../Assets/${booking.image[0]}`)}
              alt={booking.venue_name}
            />
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
                <span className="text-gray-700 dark:text-gray-400">
                  {booking.start_time} - {booking.end_time}
                </span>
              </p>
              <p className="mb-3">
                <span className="font-semibold text-gray-800 dark:text-gray-200">Location: </span>
                <span className="text-gray-700 dark:text-gray-400">{booking.location}</span>
              </p>
            </div>
            <div className="flex flex-col space-y-4 min-w-[200px] mx-4 self-center mt-4 ml-12 mb-4 h-[130px] justify-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 focus:outline-none"
                onClick={() =>
                  navigate("/payment-confirmation", { state: { book_id: booking.booking_id, eventName: booking.event_name } })
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

              {/* Show "Proceed to Payment" only if booking is accepted */}
              {booking.status === "Accepted" && (
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600 focus:outline-none"
                  onClick={() => navigate("/payment", { state: { bookingDetails: booking   } })}
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-10 w-full">
      {/* Pending Bookings Section */}
      <div className="w-full max-w-4xl">
        <button
          className="w-full flex justify-between items-center bg-gray-200 text-gray-900 px-4 py-3 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none"
          onClick={() => setShowPending(!showPending)}
        >
          <span className="text-lg font-bold">Pending Bookings</span>
          <span className="text-xl">{showPending ? "▲" : "▼"}</span>
        </button>
        <div className={`overflow-auto transition-all duration-300 m-3 ease-in-out ${showPending ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
          {renderBookings(pendingBookings)}
        </div>
      </div>

      {/* Accepted Bookings Section */}
      <div className="w-full max-w-4xl">
        <button
          className="w-full flex justify-between items-center bg-gray-200 text-gray-900 px-4 py-3 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none"
          onClick={() => setShowAccepted(!showAccepted)}
        >
          <span className="text-lg font-bold">Accepted Bookings</span>
          <span className="text-xl">{showAccepted ? "▲" : "▼"}</span>
        </button>
        <div className={`overflow-auto transition-all duration-300 m-3 ease-in-out ${showAccepted ? "opacity-100" : "opacity-0"}`}
          style={{ maxHeight: showAccepted ? "500px" : "0px" }}>
          {renderBookings(acceptedBookings)}
        </div>
      </div>

      {/* Successful Bookings Section */}
      <div className="w-full max-w-4xl">
        <button
          className="w-full flex justify-between items-center bg-gray-200 text-gray-900 px-4 py-3 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none"
          onClick={() => setShowSuccess(!showSuccess)}
        >
          <span className="text-lg font-bold">Successful Bookings</span>
          <span className="text-xl">{showSuccess ? "▲" : "▼"}</span>
        </button>
        <div className={`overflow-auto transition-all duration-300 m-3 ease-in-out ${showSuccess ? "opacity-100" : "opacity-0"}`}
          style={{ maxHeight: showSuccess ? "500px" : "0px" }}>
          {renderBookings(successBookings)}
        </div>
      </div>
    </div>
  );
};

export default BookingsList;
 