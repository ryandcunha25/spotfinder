import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../SearchContext";

const Spots = () => {
    const [venues, setVenues] = useState([]);
    const [selectedEventTypes, setSelectedEventTypes] = useState([]);
    const [selectedCapacities, setSelectedCapacities] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    // Event type options
    const eventTypes = ["Conference", "Weddings", "Birthdays", "Corporate"];
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
        <div className="container w-full gap-12 m-10 pl-12 flex">
            {/* Sidebar */}
            <div className="h-fit bg-white w-1/4 sticky pt-4 pb-6 shadow rounded overflow-hidden">
                <div className="divide-y divide-gray-200 space-y-5 px-6">
                    {/* Event Type Filter */}
                    <div>
                        <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                            Event Type
                        </h3>
                        <div className="space-y-2">
                            {eventTypes.map((event, index) => (
                                <div className="flex items-center" key={index}>
                                    <input
                                        type="checkbox"
                                        id={`event-${index}`}
                                        value={event}
                                        onChange={handleEventTypeChange}
                                        className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`event-${index}`}
                                        className="text-gray-600 ml-3 cursor-pointer"
                                    >
                                        {event}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Venue Capacity Filter */}
                    <div className="pt-4">
                        <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                            Venue Capacity
                        </h3>
                        <div className="space-y-2">
                            {capacityOptions.map((option, index) => (
                                <div className="flex items-center" key={index}>
                                    <input
                                        type="checkbox"
                                        id={`capacity-${index}`}
                                        value={option.label}
                                        onChange={handleCapacityChange}
                                        className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`capacity-${index}`}
                                        className="text-gray-600 ml-3 cursor-pointer"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="pt-4">
                        <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
                            Price
                        </h3>
                        <div className="mt-4 flex items-center">
                            <input
                                type="number"
                                className="w-full border-gray-300 focus:border-primary focus:ring-0 px-3 py-1 text-gray-600 text-sm shadow-sm rounded"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) =>
                                    setPriceRange({ ...priceRange, min: e.target.value })
                                }
                            />
                            <span className="mx-3 text-gray-800">-</span>
                            <input
                                type="number"
                                className="w-full border-gray-300 focus:border-primary focus:ring-0 px-3 py-1 text-gray-600 text-sm shadow-sm rounded"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) =>
                                    setPriceRange({ ...priceRange, max: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Venues List Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-3/4">
                {filteredVenues.length > 0 ? (
                    filteredVenues.map((venue) => (
                        <div
                            key={venue.venue_id}
                            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        >
                            <img
                                className="rounded-t-lg w-full"
                                src={require(`./../Assets/${venue.image[0]}`)}
                                alt={venue.venue_id}
                            />
                            <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {venue.name}
                                </h5>
                                <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                                    <strong>Location:</strong> {venue.location}
                                </p>
                                <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                                    <strong>Price:</strong> ₹{venue.price} per day
                                </p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    <strong>Capacity:</strong> {venue.capacity} people
                                </p>
                                <Link
                                    to={`/venues/${venue.venue_id}`}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-700">No venues match your filters.</p>
                )}
            </div>
        </div>
    );
};

export default Spots;
