import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const MyVenues = () => {
    const [venues, setVenues] = useState([]);
    const [newVenue, setNewVenue] = useState({
        name: "",
        location: "",
        capacity: "",
        price: "",
        contact: "",
        category: [],
        description: "",
        amenities: [],
        images: [],
    });

    const [editingVenue, setEditingVenue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchVenues = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const ownerId = localStorage.getItem("ownerId");

                if (!ownerId) {
                    setError("Owner ID not found. Please log in again.");
                    return;
                }

                const response = await fetch(`http://localhost:5000/venues/ownerspecific/${ownerId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch venues");
                }

                const data = await response.json();
                setVenues(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching venues:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVenues();
    }, []);

    const handleImageUpload = (e) => {
        const fileNames = Array.from(e.target.files).map((file) => file.name);
        setNewVenue((prev) => ({
            ...prev,
            images: fileNames,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingVenue) {
            setEditingVenue((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewVenue((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddVenue = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const ownerId = localStorage.getItem("ownerId") || sessionStorage.getItem("ownerId");
            
            const newVenueData = {
                ownerId,
                name: newVenue.name,
                location: newVenue.location,
                capacity: newVenue.capacity,
                price: newVenue.price,
                contact: newVenue.contact,
                category: newVenue.category.split(",").map((cat) => cat.trim()),
                description: newVenue.description,
                amenities: newVenue.amenities.split(",").map((amenity) => amenity.trim()),
                images: newVenue.images,
            };

            const response = await fetch("http://localhost:5000/venues/add-venue", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newVenueData),
            });

            if (!response.ok) {
                throw new Error("Failed to add venue");
            }

            const data = await response.json();
            setVenues((prev) => [...prev, data]);
            setNewVenue({
                name: "",
                location: "",
                capacity: "",
                price: "",
                contact: "",
                category: [],
                description: "",
                amenities: [],
                images: [],
            });
            setSuccessMessage("Venue added successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error adding venue:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditVenue = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/venues/edit-venue/${editingVenue.venue_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editingVenue),
            });

            if (!response.ok) {
                throw new Error("Failed to update venue");
            }

            setVenues((prev) =>
                prev.map((venue) =>
                    venue.venue_id === editingVenue.venue_id ? editingVenue : venue
                )
            );
            setEditingVenue(null);
            setSuccessMessage("Venue updated successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error editing venue:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteVenue = async (venueId) => {
        if (!window.confirm("Are you sure you want to delete this venue?")) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/venues/delete-venue/${venueId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete venue");
            }

            setVenues((prev) => prev.filter((venue) => venue.venue_id !== venueId));
            setSuccessMessage("Venue deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error deleting venue:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64">
                
                <main className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Venues</h1>
                        {editingVenue && (
                            <button
                                onClick={() => setEditingVenue(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    {/* List of Venues */}
                    <div className="mb-10">
                        
                        {isLoading && !venues.length ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : venues.length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <p className="text-gray-500">You haven't added any venues yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {venues.map((venue) => (
                                    <div
                                        key={venue.venue_id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                                    >
                                        {venue.images && venue.images.length > 0 && (
                                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">Venue Image</span>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold text-gray-800">{venue.name}</h3>
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    ${venue.price}/day
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Location:</span> {venue.location}
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Capacity:</span> {venue.capacity}
                                            </p>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {venue.description}
                                            </p>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setEditingVenue(venue)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVenue(venue.venue_id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Venue Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            {editingVenue ? "Edit Venue" : "Add New Venue"}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Venue Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Grand Ballroom"
                                        value={editingVenue ? editingVenue.name : newVenue.name}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="123 Main St, City"
                                        value={editingVenue ? editingVenue.location : newVenue.location}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Capacity</label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            placeholder="100"
                                            value={editingVenue ? editingVenue.capacity : newVenue.capacity}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Price ($/day)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="500"
                                            value={editingVenue ? editingVenue.price : newVenue.price}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 mb-2">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        placeholder="+1234567890"
                                        value={editingVenue ? editingVenue.contact : newVenue.contact}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Categories (comma separated)</label>
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="Wedding, Conference, Party"
                                        value={editingVenue ? editingVenue.category : newVenue.category}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 mb-2">Amenities (comma separated)</label>
                                    <input
                                        type="text"
                                        name="amenities"
                                        placeholder="WiFi, Parking, Catering"
                                        value={editingVenue ? editingVenue.amenities : newVenue.amenities}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Describe your venue..."
                                        rows="3"
                                        value={editingVenue ? editingVenue.description : newVenue.description}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 mb-2">Venue Images</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                id="images" 
                                                name="images" 
                                                multiple 
                                                onChange={handleImageUpload} 
                                                className="hidden" 
                                            />
                                        </label>
                                    </div>
                                    {newVenue.images.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">Selected files: {newVenue.images.join(", ")}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <button
                                onClick={editingVenue ? handleEditVenue : handleAddVenue}
                                disabled={isLoading}
                                className={`px-6 py-3 rounded-lg text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : editingVenue ? "Update Venue" : "Add Venue"}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyVenues;