import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";

const ManageRatingReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterRating, setFilterRating] = useState("all");
    const [filterVenue, setFilterVenue] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [venues, setVenues] = useState([]);
    const [analytics, setAnalytics] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [],
        reviewTrends: [],
    });

    const ownerId = localStorage.getItem("ownerId");
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];

    useEffect(() => {
        fetchReviews();
        fetchVenues();
    }, []);

    useEffect(() => {
        applyFilters();
        calculateAnalytics();
    }, [reviews, sortOrder, filterRating, filterVenue, searchQuery]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`https://84fa-115-98-235-107.ngrok-free.app/reviews/owner/${ownerId}`);

            if (response.status === 200) {
                const sortedReviews = response.data.reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setReviews(sortedReviews);

                // Ensure only unique venue IDs are stored
                const uniqueVenues = Array.from(
                    new Map(response.data.reviews.map(review => [review.venue_id, { id: review.venue_id, name: review.name }])).values()
                );

                setVenues(uniqueVenues);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchVenues = async () => {
        try {
            const response = await axios.get(`https://84fa-115-98-235-107.ngrok-free.app/venues/owner/${ownerId}`);
            if (response.status === 200) {
                setVenues(response.data.venues);
            }
        } catch (error) {
            console.error("Error fetching venues:", error);
        }
    };

    const applyFilters = () => {
        let updatedReviews = [...reviews];

        // Rating filter
        if (filterRating !== "all") {
            updatedReviews = updatedReviews.filter(review => review.rating == filterRating);
        }

        // Venue filter
        if (filterVenue !== "all") {
            updatedReviews = updatedReviews.filter(review => review.venue_id == filterVenue);
        }

        // Search filter
        if (searchQuery.trim()) {
            const searchLower = searchQuery.toLowerCase();
            updatedReviews = updatedReviews.filter(review =>
                `${review.first_name} ${review.last_name}`.toLowerCase().includes(searchLower) ||
                (review.venue_name && review.venue_name.toLowerCase().includes(searchLower)))
        }

        // Sort order
        if (sortOrder === "newest") {
            updatedReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortOrder === "oldest") {
            updatedReviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        setFilteredReviews(updatedReviews);
    };

    const calculateAnalytics = () => {
        let reviewsToAnalyze = [...reviews];

        if (filterVenue !== "all") {
            reviewsToAnalyze = reviewsToAnalyze.filter(review => review.venue_id == filterVenue);
        }

        const totalReviews = reviewsToAnalyze.length;
        const ratingSum = reviewsToAnalyze.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "N/A";

        const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
            rating: `${rating} Stars`,
            count: reviewsToAnalyze.filter(review => review.rating === rating).length,
        }));

        const reviewsByMonth = reviewsToAnalyze.reduce((acc, review) => {
            let month = new Date(review.created_at).toLocaleString("default", { month: "short", year: "numeric" });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const reviewTrends = Object.keys(reviewsByMonth).map(month => ({
            month,
            reviews: reviewsByMonth[month],
        }));

        setAnalytics({ totalReviews, averageRating, ratingDistribution, reviewTrends });
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="ml-64 flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">Loading reviews...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="ml-64 flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Review Management</h2>
                        <div className="text-sm text-gray-500">
                            Showing {filteredReviews.length} of {reviews.length} reviews
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                            <div className="flex items-center mt-2">
                                <span className="text-3xl font-bold text-gray-800">{analytics.averageRating}</span>
                                <span className="ml-1 text-gray-500">/ 5</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                            <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
                            <div className="mt-2">
                                <span className="text-3xl font-bold text-gray-800">{analytics.totalReviews}</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                            <h3 className="text-sm font-medium text-gray-500">Latest Review</h3>
                            <div className="mt-2">
                                {reviews.length > 0 ? (
                                    <>
                                        <p className="text-gray-600 whitespace-normal break-words line-clamp-2">
                                            "{reviews[0].review_text}"
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {reviews[0].venue_name || "Unknown Venue"}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-400 italic">No reviews yet</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filterRating}
                                    onChange={(e) => setFilterRating(e.target.value)}
                                >
                                    <option value="all">All Ratings</option>
                                    {[5, 4, 3, 2, 1].map(r => (
                                        <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filterVenue}
                                    onChange={(e) => setFilterVenue(e.target.value)}
                                >
                                    <option value="all">All Venues</option>
                                    {venues.map(venue => (
                                        <option key={venue.id} value={venue.id}>{venue.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search by name or venue..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h3>
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="mt-2 text-lg font-medium text-gray-900">No reviews found</h4>
                                <p className="mt-1 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredReviews.map((review) => (
                                    <div key={review.review_id} className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{review.first_name} {review.last_name}</h4>
                                                <p className="text-sm text-gray-500">Reviewed Venue: <span className="font-semibold">{review.name || "Unknown Venue"}</span></p>
                                                <div className="flex items-center mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-500">{review.rating} out of 5</span>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-gray-600">{review.review_text}</p>
                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                                            {/* <span className="bg-gray-100 px-3 py-1 rounded-full">
                            Venue: {review.name || "Unknown Venue"}
                        </span> */}
                                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                Booking ID: {review.booking_id}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Rating Distribution */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Rating Distribution
                                {filterVenue !== "all" && (
                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                        (Filtered: {venues.find(v => v.id == filterVenue)?.name || "Selected Venue"})
                                    </span>
                                )}
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.ratingDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            innerRadius={40}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="rating"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {analytics.ratingDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name, props) => [
                                                value,
                                                `${name} (${(props.payload.percent * 100).toFixed(1)}%)`
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Review Trends */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Review Trends
                                {filterVenue !== "all" && (
                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                        (Filtered: {venues.find(v => v.id == filterVenue)?.name || "Selected Venue"})
                                    </span>
                                )}
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analytics.reviewTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: '#6b7280' }}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            tick={{ fill: '#6b7280' }}
                                            tickMargin={10}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="reviews"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageRatingReviews;