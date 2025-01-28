import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const ownerId = localStorage.getItem("ownerId") || "no owner found"
    const ownerName = localStorage.getItem("fullName")
    const Logout = () => {
        console.log(localStorage.getItem('token'))
        localStorage.removeItem('token'); // Remove token on logout
        localStorage.removeItem('ownerId'); // Remove token on logout
        localStorage.removeItem('fullName'); // Remove token on logout
        console.log('Logout successful!');
        window.location.href = 'http://localhost:3000/venueownerslogin'; // Redirect to login page
    }
    return (
        <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            {/* Sidebar Header */}
            <div className="px-6 py-4 text-2xl font-bold border-b border-gray-700">
                Id: ({ownerId}) {ownerName}
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow px-4 py-6">
                <ul className="space-y-4">
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-home w-5 h-5"></i>
                        <span>Dashboard</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-building w-5 h-5"></i>
                        <span>My Venues</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-calendar w-5 h-5"></i>
                        <span>Bookings</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-dollar-circle w-5 h-5"></i>
                        <span>Payments</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-star w-5 h-5"></i>
                        <span>Reviews & Ratings</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-bar-chart w-5 h-5"></i>
                        <span>Analytics</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-tag w-5 h-5"></i>
                        <span>Promotions</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-envelope w-5 h-5"></i>
                        <span>Messages/Support</span>
                    </li>
                    <li className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                        <i className="bx bx-cog w-5 h-5"></i>
                        <span>Settings</span>
                    </li>
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="px-4 py-6 border-t border-gray-700">
                <button onClick={Logout} className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-700">
                    <i className="bx bx-log-out w-5 h-5"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;


