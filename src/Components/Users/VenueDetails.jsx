import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VenueMap from './VenueMap'; // Adjust the import path as needed

const VenueDetails = () => {
    let { venueId } = useParams(); // Capture venueId from URL
    // venueId = parseInt(venueId)
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
                    console.log(reviews)
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
        navigate(`/venues/${venueId}/book-venue`, {
            state: { price: venue.price },
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
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-semibold text-gray-900 mb-3">{venue.name}</h2>
                <p className="text-gray-700 mb-4">{venue.description}</p>

                <div className="space-y-2">
                    <p className="text-xl text-primary font-bold">Price: ${venue.price}</p>
                    <p className="flex items-center text-lg text-yellow-500">
                        Ratings: {Array.from({ length: Math.floor(venue.ratings) }).map((_, index) => (
                            <span key={index}>★</span>
                        ))}
                    </p>
                    <p className="text-lg font-medium">Capacity: <span className="text-gray-600">{venue.capacity} people</span></p>
                    <p className="text-lg font-medium">Location: <span className="text-gray-600">{venue.location}</span></p>
                    <p className="text-lg font-medium">Amenities:</p>
                    <ul className="grid grid-cols-2 gap-2 text-gray-700 text-lg ml-4">
                        {amenities.length > 0 ? (
                            amenities.map((amenity, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="text-blue-500">✔</span> {amenity}
                                </li>
                            ))
                        ) : (
                            <p>Loading amenities...</p>
                        )}
                    </ul>

                    <p className="text-lg font-medium">Contact: <span className="text-gray-600">{venue.owner} ({venue.contact})</span></p>
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={bookVenue} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Book Now
                    </button>
                    <button onClick={AddToWishlist} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition">
                        Add to Wishlist
                    </button>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="md:col-span-2 mt-8">
                <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
                {reviews.length > 0 ? (
                    <ul className="bg-gray-100 p-4 rounded-lg">
                        {reviews.map((review, index) => (
                            <li key={index} className="border-b py-3">
                                <span className="font-semibold">{review.first_name + " " + review.last_name}</span>
                                <span className="text-yellow-500 mx-3">{'★'.repeat(review.rating)} ({review.rating}/5)</span>
                                <p>{review.review_text}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews yet. Be the first to review this venue!</p>
                )}
            </div>
        </div>
    ) : (
        <p className="text-center text-gray-500">Loading venue details...</p>
    );
};

export default VenueDetails;
