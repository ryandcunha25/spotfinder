import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate(); // For navigation


    useEffect(() => {
        const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to view your wishlist');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/favourites/wishlist', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (response.ok) {
                    setWishlist(data.wishlist);
                } else {
                    alert(data.message || 'Failed to fetch wishlist');
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (venueId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to remove venues');
            return;
        }
        console.log(venueId)

        try {
            const response = await fetch('http://localhost:5000/favourites/remove-from-wishlist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ venue_id: venueId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Venue removed from wishlist!');
                setWishlist(wishlist.filter((venue) => venue.id !== venueId));
                window.location.reload();
            } else {
                alert(data.message || 'Failed to remove venue from wishlist');
            }
        } catch (error) {
            console.error('Error removing venue from wishlist:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    const handleViewDetails = (venueId) => {
        navigate(`/venues/${venueId}`); // Navigate to venue details page
    }

    return (
        <div className="p-12">
            <h2 className="text-center text-3xl font-bold border-b-2 border-gray-300 pb-2">My Wishlist</h2>
            <div className="grid grid-cols-3 gap-6 p-10">
                {wishlist.map((venue) => (
                    <div key={venue.id} className="p-4 border rounded shadow-md">
                        <img
                            src={require(`./../Assets/${venue.image[0]}`)}
                            alt={venue.name}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h3 className="text-xl font-bold mt-2">{venue.name} <i>(&#8377;{venue.price})</i></h3>
                        <p className="text-gray-600">{venue.description}</p>
                        <p className="text-gray-800 font-semibold mt-3 gap-2 flex items-center justify-between">
                            
                        <button
                                className="bg-green-500 text-white w-2/4 px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={() => handleViewDetails(venue.venue_id)}
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => handleRemove(venue.venue_id)}
                                className="bg-red-500 text-white w-2/4 px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
