// src/Analytics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import Sidebar from './Sidebar';

// Custom tick component that wraps text into two lines if needed
const CustomizedXAxisTick = ({ x, y, payload }) => {
    const text = payload.value;
    // Split the label into words and create two lines:
    const words = text.split(' ');
    // If the label contains more than one word, break it into two lines.
    const firstLine = words[0];
    const secondLine = words.slice(1).join(' ');
    return (
        <g transform={`translate(${x},${y + 10})`}>
            <text x={0} y={0} textAnchor="middle" fill="#666" fontSize="12">
                {firstLine}
            </text>
            {secondLine && (
                <text x={0} y={0} dy="1.2em" textAnchor="middle" fill="#666" fontSize="10">
                    {secondLine}
                </text>
            )}
        </g>
    );
};

const Analytics = () => {
    // States for each analytic dataset
    const [bookingsPerVenue, setBookingsPerVenue] = useState([]);
    const [revenueByBookings, setRevenueByBookings] = useState([]);
    const [revenueByPayments, setRevenueByPayments] = useState([]);
    const [ratingsReviews, setRatingsReviews] = useState([]);
    const [bookingTrends, setBookingTrends] = useState([]);
    const [paymentTrends, setPaymentTrends] = useState([]);
    // States for new analytics
    const [paymentMethodDistribution, setPaymentMethodDistribution] = useState([]);
    const [popularEventTypes, setPopularEventTypes] = useState([]);
    const [userEngagement, setUserEngagement] = useState(null);
    const [cancellationRate, setCancellationRate] = useState([]);
    const [avgEventDuration, setAvgEventDuration] = useState([]);
    const [avgBookingLeadTime, setAvgBookingLeadTime] = useState([]);
    const [ratingDistribution, setRatingDistribution] = useState([]);

    const pieColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];


    // Get ownerId from localStorage (or another source)
    const ownerId = localStorage.getItem('ownerId');
    console.log('Owner ID:', ownerId);

    useEffect(() => {
        if (!ownerId) return;

        // Fetch Total Bookings per Venue
        axios
            .get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/totalBookingsPerVenue?ownerId=${ownerId}`)
            .then((response) => setBookingsPerVenue(response.data))
            .catch((error) => console.error('Error fetching bookings per venue:', error));

        // Fetch Total Revenue per Venue (Bookings Data)
        axios
            .get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/totalRevenueByBookings?ownerId=${ownerId}`)
            .then((response) => setRevenueByBookings(response.data))
            .catch((error) => console.error('Error fetching revenue by bookings:', error));

        // Fetch Total Revenue per Venue (Payments Data)
        axios
            .get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/totalRevenueByPayments?ownerId=${ownerId}`)
            .then((response) => setRevenueByPayments(response.data))
            .catch((error) => console.error('Error fetching revenue by payments:', error));

        // Fetch Average Rating and Total Reviews per Venue
        axios
            .get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/ratingsAndReviews?ownerId=${ownerId}`)
            .then((response) => setRatingsReviews(response.data))
            .catch((error) => console.error('Error fetching ratings and reviews:', error));

        // Fetch Booking Trends by Month
        axios
            .get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/bookingTrends?ownerId=${ownerId}`)
            .then((response) => setBookingTrends(response.data))
            .catch((error) => console.error('Error fetching booking trends:', error));

        // Fetch Payment Trends by Month
        axios
            .get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/paymentTrends?ownerId=${ownerId}`)
            .then((response) => setPaymentTrends(response.data))
            .catch((error) => console.error('Error fetching payment trends:', error));

        // New endpoints
        axios.get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/paymentMethodDistribution?ownerId=${ownerId}`)
            .then(response => setPaymentMethodDistribution(response.data))
            .catch(error => console.error('Error fetching payment method distribution:', error));

        axios.get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/popularEventTypes?ownerId=${ownerId}`)
            .then(response => setPopularEventTypes(response.data))
            .catch(error => console.error('Error fetching popular event types:', error));

        axios.get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/userEngagement?ownerId=${ownerId}`)
            .then(response => setUserEngagement(response.data))
            .catch(error => console.error('Error fetching user engagement:', error));

        axios.get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/cancellationRate?ownerId=${ownerId}`)
            .then(response => setCancellationRate(response.data))
            .catch(error => console.error('Error fetching cancellation rate:', error));

        axios.get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/averageEventDuration?ownerId=${ownerId}`)
            .then(response => setAvgEventDuration(response.data))
            .catch(error => console.error('Error fetching average event duration:', error));

        axios.get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/averageBookingLeadTime?ownerId=${ownerId}`)
            .then(response => setAvgBookingLeadTime(response.data))
            .catch(error => console.error('Error fetching average booking lead time:', error));

        axios.get(`https://84fa-115-98-235-107.ngrok-free.app/analytics/ratingDistribution?ownerId=${ownerId}`)
            .then(response => setRatingDistribution(response.data))
            .catch(error => console.error('Error fetching rating distribution:', error));

    }, [ownerId]);

    return (
        <div className="flex min-h-screen bg-gray-200">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">Analytics Dashboard</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            A comprehensive overview of your venue performance.
                        </p>
                    </header>

                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                        {/* Total Bookings per Venue */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Total Bookings per Venue
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={bookingsPerVenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} tick={<CustomizedXAxisTick />} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar barSize={50} dataKey="total_bookings" fill="#4F46E5" name="Total Bookings" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Total Revenue per Venue (Bookings Data) */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Total Revenue (Bookings Data)
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueByBookings}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} tick={<CustomizedXAxisTick />} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total_revenue" fill="#10B981" name="Revenue (Bookings)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Total Revenue per Venue (Payments Data) */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Total Revenue (Payments Data)
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueByPayments}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} tick={<CustomizedXAxisTick />} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total_revenue" fill="#F59E0B" name="Revenue (Payments)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Payment Method Distribution (PieChart) */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">
                                Payment Method Distribution
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={paymentMethodDistribution.map(item => ({
                                            ...item,
                                            method_count: Number(item.method_count),
                                        }))}
                                        dataKey="method_count"
                                        nameKey="payment_method"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={110}  // Increased outer radius for larger slices
                                        innerRadius={0}    // Set to 0 for a full pie chart
                                        label             // Enable labels on slices
                                    >
                                        {paymentMethodDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Booking Trends by Month */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Booking Trends by Month
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={bookingTrends}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        interval={0}
                                        tickFormatter={(tick) => {
                                            const date = new Date(tick);
                                            // Show month name on the x-axis
                                            return date.toLocaleString('default', { month: 'long' });
                                        }}
                                    />
                                    <YAxis
                                        domain={[0, (dataMax) => Math.ceil(dataMax / 10) * 10 + 10]}
                                        tickCount={6}
                                        width={80}
                                    />
                                    <Tooltip
                                        labelFormatter={(label) => {
                                            const date = new Date(label);
                                            const day = date.getDate().toString().padStart(2, '0');
                                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                            const year = date.getFullYear().toString().slice(-2);
                                            return `${day}-${month}-${year}`;
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="bookings_count"
                                        stroke="#4F46E5"
                                        name="Bookings Count"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Payment Trends by Month */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Payment Trends by Month
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={paymentTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        interval={0}
                                        tickFormatter={(tick) => {
                                            const date = new Date(tick);
                                            // Show month name on the x-axis
                                            return date.toLocaleString('default', { month: 'long' });
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        labelFormatter={(label) => {
                                            const date = new Date(label);
                                            const day = date.getDate().toString().padStart(2, '0');
                                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                            const year = date.getFullYear().toString().slice(-2);
                                            return `${day}-${month}-${year}`;
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="payment_count"
                                        stroke="#10B981"
                                        name="Payment Count"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total_revenue"
                                        stroke="#F59E0B"
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Average Rating and Total Reviews per Venue */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Average Rating & Total Reviews
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ratingsReviews}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} tick={<CustomizedXAxisTick />} />
                                    <YAxis
                                        yAxisId="left"
                                        orientation="left"
                                        label={{ value: 'Avg Rating', angle: -90, position: 'insideLeft' }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{ value: 'Total Reviews', angle: 90, position: 'insideRight' }}
                                    />
                                <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                                <Legend />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="avg_rating"
                                        fill="#4F46E5"
                                        name="Avg Rating"
                                    />
                                    <Bar
                                        yAxisId="right"
                                        dataKey="total_reviews"
                                        fill="#10B981"
                                        name="Total Reviews"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Rating Distribution per Venue (Grouped BarChart) */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 col-span-1">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                Rating Distribution per Venue
                            </h2>
                            {ratingDistribution.length > 0 ? (() => {
                                // Extract unique venue names from your raw data
                                const uniqueVenues = [...new Set(ratingDistribution.map(item => item.name))];
                                // Define a color palette for each venue
                                const venueColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];


                                const pivotData = () => {
                                    const grouped = {};
                                    ratingDistribution.forEach(item => {
                                        const { rating, name, count_per_rating } = item;
                                        if (!grouped[rating]) {
                                            grouped[rating] = { rating };
                                        }
                                        grouped[rating][name] = count_per_rating;
                                    });
                                    // Sort pivoted data by rating (if desired)
                                    return Object.values(grouped).sort((a, b) => a.rating - b.rating);
                                };
                                const data = pivotData();

                                return (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data} >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="rating" label={{ value: 'Rating', position: 'insideBottom', offset: -1 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            {uniqueVenues.map((venue, index) => (
                                                <Bar
                                                    key={venue}
                                                    dataKey={venue}
                                                    fill={venueColors[index % venueColors.length]}
                                                    name={venue}
                                                    barSize={40}
                                                />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                );
                            })() : (
                                <p>No data available</p>
                            )}
                        </div>
                    </div>


                    {/* Popular Event Types (BarChart) */}
                    <div className="bg-white p-6 mt-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Popular Event Types
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={popularEventTypes}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="event_type" interval={0} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="event_count" fill="#4F46E5" name="Event Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* User Engagement (Card Display) */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            User Engagement
                        </h2>
                        {userEngagement ? (
                            <div className="text-center">
                                <p className="text-lg text-gray-800">
                                    Total Reviews: <span className="font-semibold">{userEngagement.total_reviews}</span>
                                </p>
                                <p className="text-lg text-gray-800 mt-2">
                                    Average Rating: <span className="font-semibold">{Number(userEngagement.average_rating).toFixed(2)}</span>
                                </p>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    {/* Cancellation Rate per Venue (BarChart) */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Cancellation Rate per Venue (%)
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={cancellationRate}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" interval={0} />
                                <YAxis />
                                <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                                <Legend />
                                <Bar dataKey="cancellation_rate_percentage" fill="#F59E0B" name="Cancellation Rate" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Average Event Duration per Venue (BarChart) */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Avg Event Duration per Venue (Hours)
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={avgEventDuration}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" interval={0} />
                                {/* Compute explicit ticks */}
                                <YAxis
                                    ticks={
                                        avgEventDuration.length > 0
                                            ? Array.from(
                                                { length: Math.ceil(Math.max(...avgEventDuration.map(item => item.avg_event_duration_hours))) + 1 },
                                                (_, i) => i
                                            )
                                            : [0, 1, 2, 3, 4, 5]
                                    }
                                />
                                <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                                <Legend />
                                <Bar
                                    dataKey="avg_event_duration_hours"
                                    fill="#10B981"
                                    name="Duration (hrs)"
                                    animationDuration={2000}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Average Booking Lead Time per Venue (BarChart) */}
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            Avg Booking Lead Time per Venue (Days)
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={avgBookingLeadTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" interval={0} />
                                <YAxis />
                                <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                                <Legend />
                                <Bar dataKey="avg_lead_time_days" fill="#EF4444" name="Lead Time (days)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default Analytics;
