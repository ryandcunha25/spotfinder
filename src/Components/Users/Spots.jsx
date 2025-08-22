import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../SearchContext";

const Spots = () => {
    const [venues, setVenues] = useState([]);
    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [selectedCapacities, setSelectedCapacities] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const backendurl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    console.log("Backend URL:", backendurl);


    const eventTypes = ["Conference", "Weddings", "Birthdays", "Heritage"];
    const capacityOptions = [
        { label: "Less than 50", range: [0, 50] },
        { label: "50-100", range: [50, 100] },
        { label: "101-200", range: [101, 200] },
        { label: "201-500", range: [201, 500] },
        { label: "Above 500", range: [501, Infinity] },
    ];

    const { searchQuery } = useContext(SearchContext);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await fetch(`${backendurl}/venues`);
                const data = await response.json();
                setVenues(data);
            } catch (error) {
                console.error("Error fetching venue data:", error);
            }
        };

        fetchVenues();
    }, []);

    const filteredVenues = venues.filter((venue) => {
        const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesEventType = selectedEventTypes.length === 0 ||
            (Array.isArray(venue.category)
                ? selectedEventTypes.some(type => venue.category.includes(type))
                : selectedEventTypes.includes(venue.category));

        const matchesCapacity = selectedCapacities.length === 0 ||
            selectedCapacities.some(range => venue.capacity >= range[0] && venue.capacity <= range[1]);

        const matchesPrice = (!priceRange.min || venue.price >= parseInt(priceRange.min)) &&
            (!priceRange.max || venue.price <= parseInt(priceRange.max));

        return matchesSearch && matchesEventType && matchesCapacity && matchesPrice;
    });

    // Fixed filter handlers
    const handleEventTypeChange = (eventType) => {
        setSelectedEventTypes(prev =>
            prev.includes(eventType)
                ? prev.filter(type => type !== eventType)
                : [...prev, eventType]
        );
    };

    const handleCapacityChange = (range) => {
        setSelectedCapacities(prev =>
            prev.some(r => r[0] === range[0] && r[1] === range[1])
                ? prev.filter(r => !(r[0] === range[0] && r[1] === range[1]))
                : [...prev, range]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 container mx-auto px-4 py-12">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover Perfect Venues</h1>
                <p className="text-lg text-gray-600">Find the ideal space for your next event</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="bg-white h-fit lg:w-80 p-6 rounded-xl shadow-lg border border-gray-100 lg:sticky lg:top-28">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Filters</h2>

                    {/* Event Type Filter - Fixed functionality */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Event Type
                        </h3>
                        <div className="space-y-2">
                            {eventTypes.map((event, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 cursor-pointer"
                                    onClick={() => handleEventTypeChange(event)}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors 
                                        ${selectedEventTypes.includes(event) ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}>
                                        {selectedEventTypes.includes(event) && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-gray-600 hover:text-gray-800">{event}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Venue Capacity Filter - Fixed functionality */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Venue Capacity
                        </h3>
                        <div className="space-y-2">
                            {capacityOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 cursor-pointer"
                                    onClick={() => handleCapacityChange(option.range)}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors 
                                        ${selectedCapacities.some(r => r[0] === option.range[0] && r[1] === option.range[1])
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'border-gray-300 hover:border-blue-400'}`}>
                                        {selectedCapacities.some(r => r[0] === option.range[0] && r[1] === option.range[1]) && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-gray-600 hover:text-gray-800">{option.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Price Range (₹)
                        </h3>
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Venue Cards with improved text visibility */}
                <div className="flex-1">
                    {filteredVenues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                            {filteredVenues.map((venue) => (
                                <div
                                    key={venue.venue_id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            src={require(`./../Assets/${venue.image[0]}`)}
                                            alt={venue.venue_id}
                                        />
                                        {/* Text overlay with improved visibility */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                                            <h3 className="text-xl font-bold text-white drop-shadow-md">{venue.name}</h3>
                                            <p className="text-gray-200 text-sm drop-shadow-md">{venue.location}</p>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    // Determine how much of the star to fill (0-100%)
                                                    let fillPercentage = 0;
                                                    if (venue.ratings >= star) {
                                                        fillPercentage = 100; // Full star
                                                    } else if (venue.ratings > star - 1) {
                                                        fillPercentage = Math.round((venue.ratings - (star - 1)) * 100); // Partial star
                                                    }

                                                    return (
                                                        <div key={star} className="relative inline-block w-5 h-5 mr-1">
                                                            {/* Empty star background */}
                                                            <svg className="absolute w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            {/* Filled star portion */}
                                                            <div className="absolute overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <span className="text-gray-700 ml-1">({venue.ratings})</span>
                                            </div>
                                            <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {venue.category[0] || "Venue"}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                ₹{venue.price} per day
                                            </p>
                                            <p className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {venue.capacity} people
                                            </p>
                                        </div>
                                        <Link
                                            to={`/venues/${venue.name}`}
                                            state={{ venueId: venue.venue_id }}
                                            className="mt-4 block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mt-4">No venues found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
                            <button
                                onClick={() => {
                                    setSelectedEventTypes([]);
                                    setSelectedCapacities([]);
                                    setPriceRange({ min: "", max: "" });
                                }}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Spots;