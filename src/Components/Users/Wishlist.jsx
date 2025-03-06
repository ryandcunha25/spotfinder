import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

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
      } else {
        alert(data.message || 'Failed to remove venue from wishlist');
      }
    } catch (error) {
      console.error('Error removing venue from wishlist:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleViewDetails = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <h2 className="text-center text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-4 mb-8">
        My Wishlist
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {wishlist.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
          >
            <img
              src={require(`./../Assets/${venue.image[0]}`)}
              alt={venue.name}
              className="w-full h-56 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {venue.name}{" "}
                <span className="text-sm italic text-gray-600">
                  (&#8377;{venue.price})
                </span>
              </h3>
              <p className="text-gray-700 mb-4">{venue.description}</p>
              <div className="flex justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  onClick={() => handleViewDetails(venue.venue_id)}
                >
                  View Details
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  onClick={() => handleRemove(venue.venue_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
