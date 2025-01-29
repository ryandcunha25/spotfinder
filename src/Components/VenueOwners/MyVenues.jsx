import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MyVenues = () => {
    const [venues, setVenues] = useState([]); // Stores all venues
    const [newVenue, setNewVenue] = useState({
        name: "",
        location: "",
        capacity: "",
        price: "",
        contact: "",       // Contact number (numeric)
        category: [],      // Category (array format)
        description: "",
        amenities: [],     // Amenities (array format)
        images: [],         // Stores only the images file name
    });

    const [editingVenue, setEditingVenue] = useState(null); // Stores the venue being edited
    let fetchVenues;
    useEffect(() => {
        fetchVenues = async () => {
            try {
                const token = localStorage.getItem("token"); // Fetch token from local storage
                const ownerId = localStorage.getItem("ownerId"); // Fetch ownerId from local storage

                if (!ownerId) {
                    console.error("Owner ID not found in local storage.");
                    return;
                }

                const response = await fetch(`http://localhost:5000/venues/ownerspecific/${ownerId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(ownerId)

                const data = await response.json();
                setVenues(data);
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };

        fetchVenues();
    }, []);

    const handleImageUpload = (e) => {
        const fileNames = Array.from(e.target.files).map((file) => file.name);
        console.log(fileNames)
        setNewVenue((prev) => ({
            ...prev,
            images: fileNames, // Storing only file name
        }));

    };

    // Handle changes in input fields for adding/editing venues
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingVenue) {
            setEditingVenue((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewVenue((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Add a new venue
    const handleAddVenue = async () => {
        console.log("Adding a venue...")
        try {
            const token = localStorage.getItem("token");
            const ownerId = localStorage.getItem("ownerId");
            const newVenueData = {
                ownerId,
                name: newVenue.name,
                location: newVenue.location,
                capacity: newVenue.capacity,
                price: newVenue.price,
                contact: newVenue.contact,
                category: newVenue.category.split(",").map((cat) => cat.trim()), // Convert to array
                description: newVenue.description,
                amenities: newVenue.amenities.split(",").map((amenity) => amenity.trim()), // Convert to array
                images: newVenue.images,
            };
            console.log(newVenueData.images)
            console.log(newVenue.images)


            const response = await fetch("http://localhost:5000/venues/add-venue", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newVenueData),
            });
            const data = await response.json();
            setVenues((prev) => [...prev, data]); // Update venues list
            setNewVenue({
                name: "",
                location: "",
                capacity: "",
                price: "",
                contact: "",       // Contact number (numeric)
                category: [],      // Category (array format)
                description: "",
                amenities: [],     // Amenities (array format)
                images: [],         // Stores only the images file name
            });
            window.location.reload()
        } catch (error) {
            console.error("Error adding venue:", error);
        }
    };

    // Edit a venue
    const handleEditVenue = async () => {
        console.log("Editing a venue...")
        console.log(editingVenue)
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5000/venues/edit-venue/${editingVenue.venue_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editingVenue),
            });

            // Update venue list
            setVenues((prev) =>
                prev.map((venue) =>
                    venue.id === editingVenue.id ? editingVenue : venue
                )
            );
            setEditingVenue(null); // Clear editing state
            window.location.reload()
        } catch (error) {
            console.error("Error editing venue:", error);
        }
    };

    // Delete a venue
    const handleDeleteVenue = async (venueId) => {
        if (!window.confirm("Are you sure you want to delete this venue?")) {
          return;
        }
      
        try {
          const response = await fetch(`http://localhost:5000/venues/delete-venue/${venueId}`, {
            method: "DELETE",
          });
      
          const data = await response.json();
          if (response.ok) {
            alert("Venue deleted successfully!");
            console.log(data.message);
            window.location.reload(); // Reload page to reflect changes
          } else {
            alert(data.error || "Failed to delete venue");
          }
        } catch (error) {
          console.error("Error deleting venue:", error);
        }
      };
      
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex-1 bg-gray-50">
                {/* Navbar */}
                <Navbar />
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">My Venues</h1>

                    {/* List of Venues */}
                    <div className="mb-6">
                        {venues.map((venue) => (
                            <div
                                key={venue.id}
                                className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold">{venue.name}</h2>
                                    <p className="text-gray-700">{venue.location}</p>
                                    <p className="text-gray-700">Capacity: {venue.capacity}</p>
                                    <p className="text-gray-700">Price: ${venue.price}/day</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={() => setEditingVenue(venue)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleDeleteVenue(venue.venue_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add/Edit Venue Form */}
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">
                            {editingVenue ? "Edit Venue" : "Add New Venue"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Venue Name"
                                value={editingVenue ? editingVenue.name : newVenue.name}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={editingVenue ? editingVenue.location : newVenue.location}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="capacity"
                                placeholder="Capacity"
                                value={editingVenue ? editingVenue.capacity : newVenue.capacity}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={editingVenue ? editingVenue.price : newVenue.price}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="contact"
                                placeholder="Contact Number"
                                value={editingVenue ? editingVenue.contact : newVenue.contact}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Categories (comma-separated)"
                                value={editingVenue ? editingVenue.category : newVenue.category}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={editingVenue ? editingVenue.description : newVenue.description}
                                onChange={handleChange}
                                className="p-2 border rounded col-span-2"
                            ></textarea>
                            <input
                                type="text"
                                name="amenities"
                                placeholder="Amenities (comma-separated)"
                                value={editingVenue ? editingVenue.amenities : newVenue.amenities}
                                onChange={handleChange}
                                className="p-2 border rounded col-span-2"
                            />

                            {/* Image Upload */}
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                onChange={handleImageUpload}
                                required
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <button
                            onClick={editingVenue ? handleEditVenue : handleAddVenue}
                            className="bg-green-500 text-white px-6 py-2 rounded mt-4"
                        >
                            {editingVenue ? "Save Changes" : "Add Venue"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyVenues;
