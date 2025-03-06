import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SearchContext } from "./SearchContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch notifications when component mounts
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  const handleReviewClick = (notification) => {
    navigate("/review-form", {
      state: {
        userId,
        bookingId: notification.booking_id,
        message: notification.message,
      },
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <header className="bg-white/80 backdrop-blur-md shadow-lg">
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
            {/* Logo */}
            <Link to="#" className="flex-shrink-0">
              <img
                src={require(`./Assets/SpotFinderLogo.png`)}
                alt="logo"
                className="h-20"
              />
            </Link>
            {/* Searchbar */}
            <div className="flex-1 mx-10">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            {/* Icons */}
            <div className="flex items-center space-x-6">
              <Link
                to="/wishlist"
                className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition duration-300"
              >
                <i className="fa fa-heart text-2xl"></i>
                <span className="text-xs">Favourites</span>
              </Link>
              <Link
                to="/bookings"
                className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition duration-300"
              >
                <i className="fa fa-shopping-bag text-2xl"></i>
                <span className="text-xs">Bookings</span>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition duration-300 focus:outline-none"
                >
                  <i className="fa fa-bell text-2xl"></i>
                  <span className="text-xs">Notifications</span>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              <Link
                to="/profile"
                className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition duration-300"
              >
                <i className="fa fa-user text-2xl"></i>
                <span className="text-xs">Account</span>
              </Link>
            </div>
          </div>
        </header>
        <nav className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 shadow-md">
          <div className="container mx-auto flex items-center justify-between py-3 px-6">
            <div className="flex space-x-8">
              <Link
                to="/homepage"
                className="text-white hover:text-gray-200 transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/spots"
                className="text-white hover:text-gray-200 transition duration-300"
              >
                Spots
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-gray-200 transition duration-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-gray-200 transition duration-300"
              >
                Contact Us
              </Link>
            </div>
            <Link
              to="/"
              className="text-white hover:text-gray-200 transition duration-300"
            >
              Login/Register
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        <header className="bg-white/90 backdrop-blur-md shadow-lg">
          <div className="container mx-auto flex items-center justify-between py-3 px-4">
            {/* Hamburger Button on the Left */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Logo on the Right */}
            <Link to="#" className="flex-shrink-0">
              <img
                src={require(`./Assets/SpotFinderLogo.png`)}
                alt="logo"
                className="h-16"
              />
            </Link>
          </div>
        </header>

        {/* Backdrop (with fade transition) */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Sidebar (slides in smoothly from the left) */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform ease-in-out duration-500 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 text-3xl focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="my-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search venues..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-4">
              {/* Icon Links */}
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/wishlist"
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                <i className="fa fa-heart text-xl"></i>
                <span>Favourites</span>
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/bookings"
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                <i className="fa fa-shopping-bag text-xl"></i>
                <span>Bookings</span>
              </Link>
              <button
                onClick={() => {
                  setShowNotifications(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300 focus:outline-none"
              >
                <i className="fa fa-bell text-xl"></i>
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 rounded-full text-sm">
                    {notifications.length}
                  </span>
                )}
              </button>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/profile"
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                <i className="fa fa-user text-xl"></i>
                <span>Account</span>
              </Link>
              <hr className="my-4" />
              {/* Plain Text Navigation Links */}
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/homepage"
                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                Home
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/spots"
                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                Spots
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/about"
                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                About
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/contact"
                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                Contact Us
              </Link>
              <Link
                onClick={() => setIsMobileMenuOpen(false)}
                to="/"
                className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition duration-300"
              >
                Login/Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Modal for Both Views */}
      {showNotifications && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-96 p-6 transform transition-all duration-300 scale-105">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-800 focus:outline-none">
                &times;
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg shadow-sm">
                    <p className="text-gray-700">{notification.message}</p>
                    {notification.type === "Review_Request" && (
                      <button
                        onClick={() => handleReviewClick(notification)}
                        className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full transition duration-300"
                      >
                        Leave a Review
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No new notifications</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
