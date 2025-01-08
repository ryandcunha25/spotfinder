import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Spots = () => {
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        // Fetch venue data from the backend
        const fetchVenues = async () => {
            try {
                const response = await fetch("http://localhost:5000/venues");
                const data = await response.json();
                console.log(data)
                setVenues(data);
            } catch (error) {
                console.error("Error fetching venue data:", error);
            }
        };

        fetchVenues();
    }, []);

    return (
        <div className="container w-full gap-6 pt-8 pb-16 pl-10 flex">
            {/* Sidebar */}
            <div className="h-fit bg-white px-4 pt-4 pb-6 shadow rounded overflow-hidden">
                <div className="divide-y divide-gray-200 space-y-5 px-6">
                    {/* Category Filter */}
                    <div>
                        <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Categories</h3>
                        <div className="space-y-2">
                            {/* Single Category */}
                            {[...Array(3)].map((_, index) => (
                                <div className="flex items-center" key={index}>
                                    <input
                                        type="checkbox"
                                        id={`category-${index}`}
                                        className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`category-${index}`}
                                        className="text-gray-600 ml-3 cursor-pointer"
                                    >
                                        Category{index + 1}
                                    </label>
                                    <div className="ml-auto text-gray-600 text-sm">(15)</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div className="pt-4">
                        <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Brands</h3>
                        <div className="space-y-2">
                            {[...Array(3)].map((_, index) => (
                                <div className="flex items-center" key={index}>
                                    <input
                                        type="checkbox"
                                        id={`brand-${index}`}
                                        className="text-primary focus:ring-0 rounded-sm cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`brand-${index}`}
                                        className="text-gray-600 ml-3 cursor-pointer"
                                    >
                                        Brand{index + 1}
                                    </label>
                                    <div className="ml-auto text-gray-600 text-sm">(15)</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="pt-4">
                        <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">Price</h3>
                        <div className="mt-4 flex items-center">
                            <input
                                type="text"
                                className="w-full border-gray-300 focus:border-primary focus:ring-0 px-3 py-1 text-gray-600 text-sm shadow-sm rounded"
                                placeholder="Min"
                            />
                            <span className="mx-3 text-gray-800">-</span>
                            <input
                                type="text"
                                className="w-full border-gray-300 focus:border-primary focus:ring-0 px-3 py-1 text-gray-600 text-sm shadow-sm rounded"
                                placeholder="Max"
                            />
                        </div>
                    </div>


                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {venues.map((venue) => (
                    <div
                        key={venue.venue_id}
                        className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                        {/* Venue Image */}
                        <img
                            className="rounded-t-lg"
                            // src={require(`./Assets/${venue.image_url}`)}
                            src={require(`./Assets/${venue.image[0]}`)}
                            alt={venue.venue_id}
                        />
                        <div className="p-5">
                            {/* Venue Name */}
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {venue.name}
                            </h5>
                            {/* Venue Location */}
                            <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                                <strong>Location:</strong> {venue.location}
                            </p>
                            {/* Venue Price */}
                            <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                                <strong>Price:</strong> ₹{venue.price} per day
                            </p>
                            {/* Venue Capacity */}
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                <strong>Capacity:</strong> {venue.capacity} people
                            </p>
                            {/* Call-to-Action Button */}
                            <Link
                                to={`/venues/${venue.venue_id}`}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                View Details
                                <svg
                                    className="rtl:rotate-180 w-3.5 h-3.5 ml-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 5h12m0 0L9 1m4 4L9 9"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>;
            {/*<div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link to="#">
                    <img
                        className="rounded-t-lg"
                        src={venueimg}
                        alt="Venue"
                    />
                </Link>
                <div className="p-5">
                    <Link to="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Grand Event Hall
                        </h5>
                    </Link>
                    <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                        <strong>Location:</strong> Downtown, Cityville
                    </p>
                    <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                        <strong>Price:</strong> ₹10,000 per day
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        <strong>Capacity:</strong> 200 people
                    </p>
                    <Link
                        to="#"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        View Details
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </Link>
                </div>
            </div> */}
        </div>
    );
};

export default Spots;
