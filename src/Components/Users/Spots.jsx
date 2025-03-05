import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../SearchContext";

const Spots = () => {
    const [venues, setVenues] = useState([]);
    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [selectedCapacities, setSelectedCapacities] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    // Event type options
    const eventTypes = ["Conference", "Weddings", "Birthdays", "Heritage"];
    const capacityOptions = [
        { label: "Less than 50", range: [0, 50] },
        { label: "50-100", range: [50, 100] },
        { label: "101-200", range: [101, 200] },
        { label: "201-500", range: [201, 500] },
        { label: "Above 500", range: [501, Infinity] },
    ];

    // Context for search query
    const { searchQuery } = useContext(SearchContext);

    useEffect(() => {
        // Fetch venue data from the backend
        const fetchVenues = async () => {
            try {
                const response = await fetch("http://localhost:5000/venues");
                const data = await response.json();
                setVenues(data);
            } catch (error) {
                console.error("Error fetching venue data:", error);
            }
        };

        fetchVenues();
    }, []);

    // Filter venues based on search query and other selected filters
    const filteredVenues = venues.filter((venue) => {
        const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesEventType = () => {
            if (selectedEventTypes.length === 0) {
                return true; // No event type filter applied
            }

            if (Array.isArray(venue.category)) {
                // Check if any of the selected types exist in the venue's category array
                return selectedEventTypes.some((type) => venue.category.includes(type));
            } else {
                // If the category is not an array (fallback), treat it as a single value
                return selectedEventTypes.includes(venue.category);
            }
        };

        const matchesCapacity = selectedCapacities.length === 0
            ? true
            : selectedCapacities.some(
                (range) =>
                    venue.capacity >= range[0] && venue.capacity <= range[1]
            );

        const matchesPrice =
            (!priceRange.min || venue.price >= parseInt(priceRange.min)) &&
            (!priceRange.max || venue.price <= parseInt(priceRange.max));

        return (
            matchesSearch && matchesEventType() && matchesCapacity && matchesPrice
        );
    });

    // Toggle event type filter
    const handleEventTypeChange = (event) => {
        const { value, checked } = event.target;

        setSelectedEventTypes((prev) => {
            const updatedTypes = [...prev];
            if (checked) {
                updatedTypes.push(value);
            } else {
                const index = updatedTypes.indexOf(value);
                if (index > -1) {
                    updatedTypes.splice(index, 1);
                }
            }
            return updatedTypes;
        });
    };

    // Toggle capacity filter
    const handleCapacityChange = (event) => {
        const { value, checked } = event.target;
        const selectedRange = capacityOptions.find(
            (option) => option.label === value
        ).range;

        setSelectedCapacities((prev) => {
            if (checked) {
                return prev.some(
                    (range) => range[0] === selectedRange[0] && range[1] === selectedRange[1]
                )
                    ? prev
                    : [...prev, selectedRange];
            } else {
                return prev.filter(
                    (range) => !(range[0] === selectedRange[0] && range[1] === selectedRange[1])
                );
            }
        });
    };

    return (
        <div className="container mx-auto py-10 flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <div className="bg-white h-fit w-1/2 lg:w-1/4 p-6 rounded-lg shadow-2xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filters</h2>

                {/* Event Type Filter */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Event Type</h3>
                    <div className="space-y-2">
                        {eventTypes.map((event, index) => (
                            <label key={index} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={event}
                                    onChange={handleEventTypeChange}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-600">{event}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Venue Capacity Filter */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Venue Capacity</h3>
                    <div className="space-y-2">
                        {capacityOptions.map((option, index) => (
                            <label key={index} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={option.label}
                                    onChange={handleCapacityChange}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-gray-600">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Price Range</h3>
                    <div className="flex items-center space-x-3">
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            className="w-full border rounded-lg p-2 text-gray-600 focus:ring focus:ring-blue-300"
                        />
                        <span className="text-gray-600">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            className="w-full border rounded-lg p-2 text-gray-600 focus:ring focus:ring-blue-300"
                        />
                    </div>
                </div>
            </div>

            {/* Venue Cards */}
            <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredVenues.length > 0 ? (
                    filteredVenues.map((venue) => (
                        <div
                            key={venue.venue_id}
                            className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105"
                        >
                            <img
                                className="w-full h-48 object-cover"
                                src={require(`./../Assets/${venue.image[0]}`)}
                                alt={venue.venue_id}
                            />
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
                                <p className="text-gray-600 mt-1">
                                    <strong>Location:</strong> {venue.location}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <strong>Price:</strong> ₹{venue.price} per day
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <strong>Capacity:</strong> {venue.capacity} people
                                </p>
                                <Link
                                    to={`/venues/${venue.venue_id}`}
                                    className="mt-4 block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:opacity-90"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-700 col-span-full">
                        No venues match your filters.
                    </p>
                )}
            </div>
        </div>

    );
};

export default Spots;
