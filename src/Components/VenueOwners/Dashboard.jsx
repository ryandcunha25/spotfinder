import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    upcomingEvents: [],
    monthlyRevenue: [],
    weeklyRevenue: [],
    pendingRequests: [],
    customerFeedback: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Update with your backend URL

        const ownerId = localStorage.getItem('ownerId'); // 
        // Fetch all data in parallel
        const [
          totalBookingsRes,
          upcomingEventsRes,
          monthlyRevenueRes,
          weeklyRevenueRes,
          pendingRequestsRes,
          customerFeedbackRes
        ] = await Promise.all([
          axios.get(`${API_BASE}/dashboard/total-bookings/${ownerId}`),
          axios.get(`${API_BASE}/dashboard/upcoming-events/${ownerId}`),
          axios.get(`${API_BASE}/dashboard/revenue-summary/monthly/${ownerId}`),
          axios.get(`${API_BASE}/dashboard/revenue-summary/weekly/${ownerId}`),
          axios.get(`${API_BASE}/dashboard/pending-requests/${ownerId}`),
          axios.get(`${API_BASE}/dashboard/customer-feedback/${ownerId}`)
        ]);

        setDashboardData({
          totalBookings: totalBookingsRes.data.total_bookings || 0,
          upcomingEvents: upcomingEventsRes.data || [],
          monthlyRevenue: monthlyRevenueRes.data || [],
          weeklyRevenue: weeklyRevenueRes.data || [],
          pendingRequests: pendingRequestsRes.data || [],
          customerFeedback: customerFeedbackRes.data || []
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getYAxisDomain = (data) => {
    if (!data.length) return [0, 100]; // Default domain if data is empty

    const minValue = Math.min(...data.map(item => item.revenue));
    const maxValue = Math.max(...data.map(item => item.revenue));

    // Round to nearest 100 or 1000 depending on max value
    const roundFactor = maxValue > 1000 ? 1000 : 100;

    const yMin = Math.floor(minValue / roundFactor) * roundFactor;  // Round down
    const yMax = Math.ceil(maxValue / roundFactor) * roundFactor;  // Round up

    return [yMin, yMax];
  };


  // Update the formatMonthlyRevenue and formatWeeklyRevenue functions:

  // Format monthly revenue data for charts (sorted by month and showing year)
  const formatMonthlyRevenue = dashboardData.monthlyRevenue
    .map(item => ({
      ...item,
      monthDate: new Date(item.month) // Create Date object for sorting
    }))
    .sort((a, b) => a.monthDate - b.monthDate) // Sort by date
    .map(item => ({
      name: `${item.monthDate.toLocaleString('default', { month: 'short' })} ${item.monthDate.getFullYear()}`,
      revenue: item.total_revenue || 0
    }));

  // Format weekly revenue data for charts (sorted by week)
  const formatWeeklyRevenue = dashboardData.weeklyRevenue
    .map(item => ({
      ...item,
      weekDate: new Date(item.week) // Create Date object for sorting
    }))
    .sort((a, b) => a.weekDate - b.weekDate) // Sort by date
    .map(item => ({
      name: `Week ${item.weekDate.getWeek()}, ${item.weekDate.getFullYear()}`,
      revenue: item.total_revenue || 0
    }));


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 bg-gray-50 ml-64">

        <main className="p-8 space-y-8">
          {/* Header */}
          <div className="head-title mb-6 flex justify-between items-center">
            <div className="left">
              <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
              <ul className="breadcrumb flex items-center space-x-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-500">Dashboard</a></li>
                <li><i className="bx bx-chevron-right"></i></li>
                <li><a className="active text-blue-500" href="#">Overview</a></li>
              </ul>
            </div>
            {/* <a href="#" className="btn-download flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
              <i className="bx bxs-cloud-download text-lg"></i>
              <span className="ml-2">Generate Report</span>
            </a> */}
          </div>

          {/* Stats Cards */}
          <ul className="box-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <li className="bg-white shadow-md rounded-lg flex items-center p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
              <i className="bx bxs-calendar-check text-blue-500 text-3xl"></i>
              <span className="ml-4 text-gray-700">
                <h3 className="text-2xl font-semibold">{dashboardData.totalBookings}</h3>
                <p className="text-gray-500">Total Bookings</p>
              </span>
            </li>
            <li className="bg-white shadow-md rounded-lg flex items-center p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
              <i className="bx bxs-group text-green-500 text-3xl"></i>
              <span className="ml-4 text-gray-700">
                <h3 className="text-2xl font-semibold">{dashboardData.upcomingEvents.length}</h3>
                <p className="text-gray-500">Upcoming Events</p>
              </span>
            </li>
            <li className="bg-white shadow-md rounded-lg flex items-center p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
              <i className="bx bxs-dollar-circle text-yellow-500 text-3xl"></i>
              <span className="ml-4 text-gray-700">
                <h3 className="text-2xl font-semibold">
                  ₹{Number(
                    dashboardData.monthlyRevenue
                      .map(item => Number(item.total_revenue) || 0)
                      .reduce((sum, revenue) => sum + revenue, 0)
                      .toFixed(0) // Changed to 0 decimal places
                  ).toLocaleString('en-IN')}
                </h3>
                <p className="text-gray-500">Total Revenue</p>
              </span>
            </li>

          </ul>

          {/* Revenue Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Revenue</h2>
              {/* Monthly Revenue Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatMonthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Revenue</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatWeeklyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      scale="linear"
                      domain={[0, 'dataMax + 600000']}
                      tickCount={6}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      allowDecimals={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(name) => `Week: ${name}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#82ca9d"
                      name="Revenue ($)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.upcomingEvents.map((event) => (
                      <tr key={event.booking_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Venue #{event.venue_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(event.booking_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Pending Approval</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.pendingRequests.map((request) => (
                      <tr key={request.booking_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Venue #{request.venue_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.event_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                          <button className="text-red-600 hover:text-red-900">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Customer Feedback */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Customer Feedback</h2>
            <div className="space-y-4">
              {dashboardData.customerFeedback.map((feedback) => (
                <div key={feedback.review_id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(feedback.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-500">
                        {feedback.rating}/5.0
                      </span>
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to get week number
Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

export default Dashboard;