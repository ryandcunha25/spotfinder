import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    format, isToday, isSameMonth, addMonths, subMonths,
    startOfMonth, endOfMonth, eachDayOfInterval, isSameDay,
    addWeeks, subWeeks, startOfWeek, endOfWeek, parseISO,
    setHours, setMinutes
} from 'date-fns';

const VenueDetails = () => {
    let { venuename } = useParams();
    const location = useLocation();
    const venueId = location.state?.venueId;
    const [venue, setVenue] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [amenities, setAmenities] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const navigate = useNavigate();

    // Helper function to parse time string (HH:MM:SS) and combine with date
    const parseTimeToDate = (dateString, timeString) => {
        const date = parseISO(dateString);
        const [hours, minutes] = timeString.split(':').map(Number);
        return setMinutes(setHours(date, hours), minutes);
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
                }
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:5000/reviews/${venueId}`);
                if (response.ok) {
                    setReviews(await response.json());
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        const fetchBookedDates = async () => {
            try {
                const response = await fetch(`http://localhost:5000/bookings/venue-booked-dates/${venueId}`);
                if (response.status === 200) {
                    const data = await response.json();
                    // Parse dates and times from database format
                    const parsedData = data.map(booking => ({
                        ...booking,
                        booking_date: parseISO(booking.booking_date),
                        startTime: parseTimeToDate(booking.booking_date, booking.start_time),
                        endTime: parseTimeToDate(booking.booking_date, booking.end_time)
                    }));
                    setBookedDates(parsedData);
                }
            } catch (error) {
                console.error('Error fetching booked dates:', error);
            }
        };

        fetchVenueDetails();
        fetchReviews();
        fetchBookedDates();
    }, [venueId]);

    // Get events for the current week (Sunday to Saturday)
    const getCurrentWeekEvents = () => {
        const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // 0 = Sunday
        const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 }); // 0 = Sunday
        const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

        return daysInWeek.map(day => ({
            date: day,
            events: bookedDates
                .filter(event => isSameDay(event.booking_date, day))
                .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
        }));
    };

    const AddToWishlist = async () => {
        const token = localStorage.getItem('token');
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

            if (response.ok) {
                alert('Venue added to wishlist!');
            } else {
                alert((await response.json()).message || 'Failed to add venue to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const bookVenue = () => {
        navigate(`/venues/${venuename}/book-venue`, {
            state: { venueId: venueId },
        });
    };

    // Calendar functions
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
    const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

    const getCalendarDays = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    const isDateBooked = (date) => {
        return bookedDates.some(bookedDate => isSameDay(bookedDate.booking_date, date));
    };

    // Format time display
    const formatTime = (date) => {
        if (!date || isNaN(date.getTime())) return 'Invalid time';
        return format(date, 'h:mm a');
    };

    // Calculate calendar height based on number of weeks
    const calendarHeight = () => {
        const weeks = Math.ceil(getCalendarDays().length / 7);
        return `${weeks * 3.5 + 8}rem`; // Adjust this calculation as needed
    };

    return venue ? (
        <div className="container mx-auto p-6 md:p-12 grid md:grid-cols-2 gap-12">
            {/* Left Column - Image Gallery */}
            <div className="flex items-center justify-center h-full">
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

            {/* Right Column - Details and Calendar */}
            <div className="space-y-8">
                {/* Venue Details */}
                <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">{venue.name}</h2>
                    <p className="text-gray-600 mb-6">{venue.description}</p>

                    <div className="flex items-center justify-between mb-6">
                        <span className="text-2xl text-indigo-600 font-semibold">
                            ${venue.price}
                        </span>

                        <div className="flex items-center">
                            <div className="relative inline-block mr-2">
                                <div className="flex text-gray-300">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-xl">★</span>
                                    ))}
                                </div>
                                <div
                                    className="absolute top-0 left-0 flex text-yellow-500 overflow-hidden"
                                    style={{ width: `${(venue.ratings / 5) * 100}%` }}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-xl">★</span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-lg font-medium text-gray-700">
                                ({venue.ratings} ratings)
                            </span>
                        </div>
                    </div>

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
                                {amenities.map((amenity, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="text-green-500">✔</span> {amenity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className="text-lg font-medium">
                            Contact: <span className="text-gray-700">{venue.owner} ({venue.contact})</span>
                        </p>
                    </div>

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
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full md:col-span-2 p-6 h-[35rem]">
                {/* Booking Calendar */}
                <div className="w-full md:w-3/5 bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Availability Calendar</h3>

                    <div className="mb-4 flex justify-between items-center">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                        >
                            &larr;
                        </button>
                        <h4 className="text-lg font-semibold text-gray-700">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h4>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                        >
                            &rarr;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-medium text-sm py-2 text-gray-600">
                                {day}
                            </div>
                        ))}

                        {getCalendarDays().map((day, i) => {
                            const booked = isDateBooked(day);
                            const today = isToday(day);

                            return (
                                <div
                                    key={i}
                                    className={`p-3 h-12 border rounded-lg flex items-center justify-center relative cursor-pointer
                                        transition hover:bg-gray-200
                                        ${!isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-gray-800'}
                                        ${booked ? 'bg-red-200 text-red-700' : ''}
                                        ${today ? 'border-blue-500 border-2' : ''}
                                    `}
                                    onClick={() => setCurrentWeek(day)}
                                >
                                    <span className={`${booked ? 'line-through' : ''}`}>{format(day, 'd')}</span>
                                    {booked && (
                                        <span className="absolute bottom-0 text-xs text-red-700">Booked</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 text-sm text-gray-600 flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-300 rounded"></div>
                        <span>Booked dates</span>
                    </div>
                </div>

                {/* Week-wise Event Timings */}
                <div className="w-full md:w-2/5 shadow-2xl rounded-2xl bg-white border border-gray-200 overflow-y-auto">
                    <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-white z-10 border-b">
                        <h3 className="text-2xl font-bold text-gray-800">Weekly Schedule</h3>
                        <div className="flex gap-2">
                            <button onClick={prevWeek} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                                &larr;
                            </button>
                            <span className="p-2 text-sm text-gray-600 font-medium">
                                {format(startOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMM d, yyyy')}
                            </span>
                            <button onClick={nextWeek} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                                &rarr;
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 px-6">
                        {getCurrentWeekEvents().map((weekDay, index) => (
                            <div key={index} className="border-b pb-3 last:border-b-0">
                                <h4 className="font-semibold text-lg text-gray-700 flex items-center">
                                    {format(weekDay.date, 'EEEE, MMM d')}
                                    {isToday(weekDay.date) && (
                                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Today</span>
                                    )}
                                </h4>

                                {weekDay.events.length > 0 ? (
                                    <ul className="space-y-3 mt-3">
                                        {weekDay.events.map((event) => (
                                            <li key={event.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-md hover:bg-gray-100 transition">
                                                <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                                                <div>
                                                    <p className="font-medium text-gray-800">Booking</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm py-2">No bookings scheduled</p>
                                )}
                            </div>
                        ))}
                    </div>
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
                                    <span className="text-md font-bold h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                        {review.first_name.charAt(0).toUpperCase()}
                                    </span>
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