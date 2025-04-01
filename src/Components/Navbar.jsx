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

    const renderNotificationIcon = (type) => {
        switch (type) {
            case "Success":
                return (
                    <div className="p-2 rounded-full bg-green-100">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case "Accepted":
                return (
                    <div className="p-2 rounded-full bg-blue-100">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case "Cancelled":
                return (
                    <div className="p-2 rounded-full bg-red-100">
                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case "Refunded":
                return (
                    <div className="p-2 rounded-full bg-yellow-100">
                        <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
                            <text x="12" y="16" fontFamily="Arial" fontSize="10" textAnchor="middle" fill="currentColor">₹</text>
                        </svg>
                    </div>
                );
            case "Review_Request":
                return (
                    <div className="p-2 rounded-full bg-purple-100">
                        <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.444a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.444a1 1 0 00-1.175 0l-3.36 2.444c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118L2.07 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="p-2 rounded-full bg-gray-100">
                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="sticky top-0 z-50">
            {/* Desktop Navbar */}
            <div className="hidden md:block">
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto flex items-center justify-between py-3 px-6">
                        {/* Logo */}
                        <Link to="#" className="flex-shrink-0">
                            <img
                                src={require(`./Assets/SpotFinderLogo.png`)}
                                alt="logo"
                                className="h-16 transition-transform hover:scale-105"
                            />
                        </Link>
                        
                        {/* Searchbar */}
                        <div className="flex-1 mx-8">
                            <div className="relative max-w-xl mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
                                className="group flex flex-col items-center text-gray-600 hover:text-blue-600 transition duration-200"
                            >
                                <div className="relative p-2 rounded-full group-hover:bg-blue-50">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs mt-1 font-medium">Favorites</span>
                            </Link>
                            
                            <Link
                                to="/bookings"
                                className="group flex flex-col items-center text-gray-600 hover:text-blue-600 transition duration-200"
                            >
                                <div className="relative p-2 rounded-full group-hover:bg-blue-50">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="text-xs mt-1 font-medium">Bookings</span>
                            </Link>
                            
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(true)}
                                    className="group flex flex-col items-center text-gray-600 hover:text-blue-600 transition duration-200 focus:outline-none"
                                >
                                    <div className="relative p-2 rounded-full group-hover:bg-blue-50">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {notifications.length > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                                {notifications.length}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs mt-1 font-medium">Notifications</span>
                                </button>
                            </div>
                            
                            <Link
                                to="/profile"
                                className="group flex flex-col items-center text-gray-600 hover:text-blue-600 transition duration-200"
                            >
                                <div className="relative p-2 rounded-full group-hover:bg-blue-50">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-xs mt-1 font-medium">Account</span>
                            </Link>
                        </div>
                    </div>
                </header>
                
                {/* Secondary Navigation */}
                <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between py-2 px-6">
                            <div className="flex space-x-8">
                                <Link
                                    to="/homepage"
                                    className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition duration-200"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/about"
                                    className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition duration-200"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/contact"
                                    className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition duration-200"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    to="/venues"
                                    className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition duration-200"
                                >
                                    Spots
                                </Link>
                                <Link
                                    to="/user-tickets"
                                    className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition duration-200"
                                >
                                    Support
                                </Link>
                            </div>
                            <Link
                                to="/"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-md transition duration-200"
                            >
                                Login/Register
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Navbar */}
            <div className="md:hidden">
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto flex items-center justify-between py-3 px-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-md hover:bg-gray-100"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        <Link to="#" className="flex-shrink-0">
                            <img
                                src={require(`./Assets/SpotFinderLogo.png`)}
                                alt="logo"
                                className="h-14 transition-transform hover:scale-105"
                            />
                        </Link>
                        
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-md hover:bg-gray-100 relative"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {notifications.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-0 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>

                <div
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <div className="text-lg font-semibold text-gray-800">Menu</div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="px-4 py-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Search venues..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-2 py-2">
                            <div className="space-y-1">
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    to="/homepage"
                                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                >
                                    Home
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    to="/venues"
                                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                >
                                    Spots
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    to="/wishlist"
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                >
                                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Favorites
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    to="/bookings"
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                >
                                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Bookings
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    to="/profile"
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                >
                                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Account
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    to="/about"
                                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                >
                                    About
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    to="/contact"
                                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                        
                        <div className="px-4 py-4 border-t">
                            <Link
                                to="/"
                                className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Login/Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications Modal */}
            {showNotifications && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">
                                Notifications
                            </h3>
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-6 py-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 pt-1">
                                                    {renderNotificationIcon(notification.type)}
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm text-gray-700">{notification.message}</p>
                                                    {notification.type === "Review_Request" && (
                                                        <button
                                                            onClick={() => {
                                                                handleReviewClick(notification);
                                                                setShowNotifications(false);
                                                            }}
                                                            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                                        >
                                                            Leave a Review
                                                            <svg className="ml-2 -mr-0.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-8 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                                    <p className="mt-1 text-sm text-gray-500">We'll notify you when something arrives.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 text-right">
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;