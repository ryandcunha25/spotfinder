import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Bookings from "./Bookings";
import TodoList from "./TodoList";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 bg-gray-50">
        {/* Navbar */}
        <Navbar />

        <main className="p-8 space-y-8">
          {/* Header */}
          <div className="head-title mb-6 flex justify-between items-center">
            <div className="left">
              <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
              <ul className="breadcrumb flex items-center space-x-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-500">Dashboard</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>
                </li>
                <li>
                  <a className="active text-blue-500" href="#">
                    Home
                  </a>
                </li>
              </ul>
            </div>
            <a
              href="#"
              className="btn-download flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              <i className="bx bxs-cloud-download text-lg"></i>
              <span className="ml-2">Download PDF</span>
            </a>
          </div>

          {/* Stats Section */}
          <ul className="box-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <li className="bg-white shadow-md rounded-lg flex items-center p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
              <i className="bx bxs-calendar-check text-blue-500 text-3xl"></i>
              <span className="ml-4 text-gray-700">
                <h3 className="text-2xl font-semibold">1020</h3>
                <p className="text-gray-500">New Order</p>
              </span>
            </li>
            <li className="bg-white shadow-md rounded-lg flex items-center p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
              <i className="bx bxs-group text-green-500 text-3xl"></i>
              <span className="ml-4 text-gray-700">
                <h3 className="text-2xl font-semibold">2834</h3>
                <p className="text-gray-500">Visitors</p>
              </span>
            </li>
            <li className="bg-white shadow-md rounded-lg flex items-center p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
              <i className="bx bxs-dollar-circle text-yellow-500 text-3xl"></i>
              <span className="ml-4 text-gray-700">
                <h3 className="text-2xl font-semibold">$2543</h3>
                <p className="text-gray-500">Total Sales</p>
              </span>
            </li>
          </ul>

          {/* Tables */}
          <div className="table-data grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Bookings />
            <TodoList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
