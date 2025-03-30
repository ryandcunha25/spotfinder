import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import VenueMap from './VenueMap'; // Adjust the import path as needed

const VenueDetails = () => {
    let { venuename } = useParams(); // Capture venueId from URL
    const location = useLocation();
    const venueId = location.state?.venueId;
    const [venue, setVenue] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [amenities, setAmenities] = useState([]);
    const [address, setAddress] = useState('');
    const [reviews, setReviews] = useState([]); // State for reviews
    const [newReview, setNewReview] = useState(''); // State for new review input
    const [rating, setRating] = useState(5); // Default rating


    const navigate = useNavigate();

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/venues/${venueId}`);
                if (response.ok) {
                    const data = await response.json();
                    setVenue(data);
                    setImages(data.image);
                    setAmenities(data.amenities);
                } else {
                    console.error('Venue not found');
                }
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                console.log(venueId);
                const response = await fetch(`http://localhost:5000/reviews/${venueId}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                } else {
                    console.error('Failed to fetch reviews');
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchVenueDetails();
        fetchReviews();
    }, [venueId]);

    const AddToWishlist = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (!token) {
            alert('You need to log in to add venues to your wishlist.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/favourites/add-to-wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ venue_id: venueId }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Venue added to wishlist!');
            } else {
                alert(data.message || 'Failed to add venue to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    // Handlers for carousel navigation
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };


    const bookVenue = () => {
        // window.location.href = 'http://localhost:3000/venues/:venueId/book-venue';
        console.log(`Venue "${venue.name}" booked successfully.`);
        navigate(`/venues/${venuename}/book-venue`, {
            state: { venueId: venueId },
        });
    };




    return venue ? (
        <div className="container mx-auto p-6 md:p-12 grid md:grid-cols-2 gap-12">
            {/* Venue Images */}
            <div className="flex items-center justify-center h-full">
                {/* Image Gallery */}
                <div className="relative w-full max-w-4xl">
                    <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                        }`}
                                >
                                    <img
                                        src={require(`../Assets/${image}`)}
                                        alt={`Venue ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Loading images...</p>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 
                w-12 h-12 bg-white/90 hover:bg-white text-gray-700 
                rounded-full flex justify-center items-center shadow-xl transition-all"
                        onClick={handlePrev}
                    >
                        &#9664;
                    </button>

                    <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 
                w-12 h-12 bg-white/90 hover:bg-white text-gray-700 
                rounded-full flex justify-center items-center shadow-xl transition-all"
                        onClick={handleNext}
                    >
                        &#9654;
                    </button>
                </div>
            </div>


            {/* Venue Details */}
            <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-8">
                {/* Venue Header */}
                <h2 className="text-4xl font-bold text-gray-800 mb-2">{venue.name}</h2>
                <p className="text-gray-600 mb-6">{venue.description}</p>

                {/* Price, Ratings & Rating Count */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl text-indigo-600 font-semibold">
                        ${venue.price}
                    </span>

                    <div className="flex items-center">
                        <div className="relative inline-block mr-2">
                            {/* Background: 5 empty stars */}
                            <div className="flex text-gray-300">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-xl">★</span>
                                ))}
                            </div>
                            {/* Foreground: filled stars clipped based on rating */}
                            <div
                                className="absolute top-0 left-0 flex text-yellow-500 overflow-hidden"
                                style={{ width: `${(venue.ratings / 5) * 100}%` }}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-xl">★</span>
                                ))}
                            </div>
                        </div>
                        {/* Display the number of ratings */}
                        <span className="text-lg font-medium text-gray-700">
                            ({venue.ratings} ratings)
                        </span>
                    </div>

                </div>

                {/* Venue Details */}
                <div className="space-y-4">
                    <p className="text-lg font-medium">
                        Capacity: <span className="text-gray-700">{venue.capacity} people</span>
                    </p>
                    <p className="text-lg font-medium">
                        Location: <span className="text-gray-700">{venue.location}</span>
                    </p>
                    <div>
                        <p className="text-lg font-medium mb-2">Amenities:</p>
                        <ul className="grid grid-cols-2 gap-2 text-gray-700 text-lg">
                            {amenities.length > 0 ? (
                                amenities.map((amenity, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="text-green-500">✔</span> {amenity}
                                    </li>
                                ))
                            ) : (
                                <p>Loading amenities...</p>
                            )}
                        </ul>
                    </div>
                    <p className="text-lg font-medium">
                        Contact: <span className="text-gray-700">{venue.owner} ({venue.contact})</span>
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex space-x-4">
                    <button
                        onClick={bookVenue}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
                    >
                        Book Now
                    </button>
                    <button
                        onClick={AddToWishlist}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300"
                    >
                        Add to Wishlist
                    </button>
                </div>
            </div>


            {/* Reviews Section */}
            <div className="md:col-span-2 mt-8">
                <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
                {reviews.length > 0 ? (
                    <ul className="bg-gray-100 p-4 rounded-lg space-y-4">
                        {reviews.map((review, index) => (
                            <li key={index} className="border-b pb-3">
                                <div className="flex items-center space-x-4">
                                    {/* Avatar */}
                                    <span className="text-md font-bold h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                        {review.first_name.charAt(0).toUpperCase()}
                                    </span>
                                    {/* Name and Rating */}
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-gray-800">
                                            {review.first_name + " " + review.last_name}
                                        </span>
                                        <span className="text-yellow-500">
                                            {'★'.repeat(review.rating)} ({review.rating}/5)
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">{review.review_text}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this venue!</p>
                )}
            </div>

        </div>
    ) : (
        <p className="text-center text-gray-500">Loading venue details...</p>
    );
};

export default VenueDetails;
