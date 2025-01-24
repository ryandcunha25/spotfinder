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

    const navigate = useNavigate();

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                console.log(venueId); // Verify this prints the expected ID
                const response = await fetch(`http://localhost:5000/venues/${venueId}`);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.amenities)
                    setVenue(data);
                    setImages(data.image);
                    setAmenities(data.amenities)
                } else {
                    console.error('Venue not found or error occurred');
                }
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        fetchVenueDetails();
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
        <div className="container grid grid-cols-2 gap-10 p-12">
            {/* Image */}
            <div id="custom-controls-gallery" className="relative w-full">
                {/* Carousel Wrapper */}
                <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                <img
                                    src={require(`../Assets/${image}`)}
                                    alt={`Carousel Item ${index + 1}`}
                                    className="absolute w-full h-full object-cover"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Loading images...</p>
                    )}
                </div>
                {/* Carousel Controls */}
                <div className="flex justify-center items-center pt-4">
                    <button
                        type="button"
                        className="flex justify-center items-center me-4 h-full cursor-pointer group focus:outline-none"
                        onClick={handlePrev}
                    >
                        <span className="text-gray-400 hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
                            <svg
                                className="rtl:rotate-180 w-5 h-5"
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
                                    d="M13 5H1m0 0l4 4M1 5l4-4"
                                />
                            </svg>
                            <span className="sr-only">Previous</span>
                        </span>
                    </button>
                    <button
                        type="button"
                        className="flex justify-center items-center h-full cursor-pointer group focus:outline-none"
                        onClick={handleNext}
                    >
                        <span className="text-gray-400 hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
                            <svg
                                className="rtl:rotate-180 w-5 h-5"
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
                            <span className="sr-only">Next</span>
                        </span>
                    </button>
                </div>

                {/* <VenueMap address={venue.location} /> */}
            </div>


            {/* Content */}
            <div className="px-2">
                <h2 className="text-3xl text-primary font-medium uppercase mb-2">{venue.name}</h2>
                <p className="text-gray-800 font-semibold">{venue.description}</p>
                <div className="flex-row items-baseline mb-1 space-y-1 font-roboto mt-4">
                    <p className="text-2xl fa text-primary font-semibold mb-2">
                        Price: &#xf156; {venue.price}
                    </p>
                    <p className="text-primary text-lg font-medium font-semibold flex items-center">
                        Ratings:{" "}
                        <span className="text-yellow-500 ml-2 text-lg">
                            {Array.from({ length: Math.floor(venue.ratings) }).map((_, index) => (
                                <span key={index} className="inline-block">★&nbsp;</span>
                            ))}
                        </span>
                    </p>

                    <p className="text-primary text-lg font-semibold">
                        Capacity: <span className="text-gray-600">{venue.capacity} people</span>
                    </p>
                    <p className="text-primary text-lg font-semibold">
                        Location: <span className="text-gray-600">{venue.location}</span>
                    </p>
                    <p className="text-primary text-lg font-semibold">
                        Amenities:
                    </p>
                    <ul className="list-disc list-inside text-gray-800">
                        {amenities.length > 0 ? (
                            amenities.map((amenity, index) => (
                                <li key={index} className="mb-1">
                                    {amenity}
                                </li>
                            ))
                        ) : (
                            <p>Loading facilities...</p>
                        )}
                    </ul>

                    <p className="text-primary text-lg font-semibold">
                        For more details, contact
                        Venue Owner: <span className="text-gray-600">{venue.owner}&nbsp;({venue.contact})</span>
                    </p>


                </div>
                <div className="flex gap-3 border-b border-gray-300 pb-5 mt-6">
                    <button
                        onClick={bookVenue}
                        className="bg-primary border border-primary text-white px-8 py-2 font-medium uppercase flex items-center gap-2 rounded-b hover:bg-transparent hover:text-primary transition"
                    >
                        <i className="fa fa-calendar-check"></i>Book Now
                    </button>
                    <button
                        onClick={AddToWishlist}
                        className="bg-primary border border-primary text-white px-8 py-2 font-medium uppercase gap-2 flex items-center rounded-b hover:bg-transparent hover:text-primary transition"
                    >
                        <i className="fa fa-heart"></i>Add to Wishlist
                    </button>
                </div>
                <div className="border-b border-gray-300 pb-5 mt-6">
                    <a
                        href="/details"
                        className="bg-green-500 border border-primary justify-center text-white px-8 py-2 font-medium uppercase flex items-center gap-2 rounded-b transition"
                    >
                        View Details
                    </a>
                </div>
            </div>
        </div>
    ) : (
        <p>Loading venue details...</p>
    );
};

export default VenueDetails;
