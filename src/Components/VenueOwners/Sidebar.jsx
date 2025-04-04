import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const ownerId = localStorage.getItem("ownerId") || "No owner found";
  const ownerName = localStorage.getItem("fullName") || "Owner";

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ownerId");
    localStorage.removeItem("fullName");
    window.location.href = "http://localhost:3000/venueownerslogin";
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="px-6 py-4 flex items-center border-b border-gray-700">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-xl font-bold">
              {ownerName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-xs text-gray-400">Owner ID: {ownerId}</p>
          <p className="text-lg font-semibold">{ownerName}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-4 py-6 overflow-y-auto">
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition"
            >
              <i className="bx bx-home text-xl mr-3"></i>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/myvenues"
              className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition"
            >
              <i className="bx bx-building text-xl mr-3"></i>
              <span className="text-sm font-medium">My Venues</span>
            </Link>
          </li>
          <li>
            <Link
              to="/managebookings"
              className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition"
            >
              <i className="bx bx-calendar text-xl mr-3"></i>
              <span className="text-sm font-medium">Bookings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/manage-review-and-ratings"
              className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition"
            >
              <i className="bx bx-star text-xl mr-3"></i>
              <span className="text-sm font-medium">Reviews & Ratings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/analytics"
              className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition"
            >
              <i className="bx bx-bar-chart text-xl mr-3"></i>
              <span className="text-sm font-medium">Analytics</span>
            </Link>
          </li>
          <li>
            <Link
              to="/ticket-handler"
              className="flex items-center p-2 rounded-lg hover:bg-gray-900 transition"
            >
              <i className="bx bx-envelope text-xl mr-3"></i>
              <span className="text-sm font-medium">Messages/Support</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-6 border-t border-gray-700">
        <button
          onClick={Logout}
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-900 transition"
        >
          <i className="bx bx-log-out text-xl mr-3"></i>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
