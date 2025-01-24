import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BookVenue = () => {
    let { venueId } = useParams();
    const location = useLocation();
    const { price } = location.state || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        // name: user.name,
        // email: '',
        // phone: '',
        eventName: '',
        eventType: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        guests: '',
        setup: '',
        catering: 'No',
        avEquipment: 'No',
        specialRequests: '',
        // paymentMethod: '',
        agreeToTerms: false,
    });
    const [venueName, setVenueName] = useState('');
    const [venues, setVenues] = useState('');
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        // Fetch categories for the given venue ID
        async function fetchCategories() {
            try {
                const response = await fetch(`http://localhost:5000/venues/${venueId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.category);
                    setVenues(data);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, [venueId]);

    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('User is not authenticated');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/token/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data);
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Unable to fetch user details');
            }
        };

        fetchUserDetails();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }
    if (!user) {
        return <div>Loading...</div>;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


    const handleProceedToPayment = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            setError('User is not authenticated');
            return;
        }
        const bookingDetails = {
            bookingId: parseInt(Date.now()),
            userId: user.id,
            venueId: venues.venue_id,
            name: venues.name,
            capacity: venues.capacity,
            price: venues.price,
            image: venues.image,
            ratings: venues.ratings,
            eventDate: formData.eventDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            eventName: formData.eventName,
            eventType: formData.eventType,
            guestCount: formData.guests,
            catering: formData.catering,
            avEquipment: formData.avEquipment,
            specialRequests: formData.specialRequests,
        };
        console.log(bookingDetails)
        try {
            const response = await axios.post('http://localhost:5000/bookings/book', bookingDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response)
            if (response.data.success) {
                alert(response.data.message);
                setFormData({
                    eventName: '',
                    eventType: '',
                    eventDate: '',
                    startTime: '',
                    endTime: '',
                    guests: '',
                    setup: '',
                    catering: 'No',
                    avEquipment: 'No',
                    specialRequests: '',
                    paymentMethod: '',
                    agreeToTerms: false,
                });
            } else {
                setError('Failed to submit booking');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            setError('Internal Server Error');
        }
        navigate('/payment', {
            state: {
                // venueDetails: {
                //     bookingId: parseInt(Date.now()),
                //     userId: user.id,
                //     name: venues.name,
                //     capacity: venues.capacity,
                //     price: venues.price,
                //     image: venues.image,
                //     ratings: venues.ratings,
                //     date: formData.eventDate,
                //     starttime: formData.startTime + " - " + formData.endTime,
                //     eventName: formData.eventName,
                //     eventType: formData.eventType,
                //     guestCount: formData.guests,
                //     catering: formData.catering,
                //     avEquipment: formData.avEquipment,
                //     specialRequests: formData.specialRequests,
                // }
bookingDetails
            },
        });
    }
    return (
        <div className="mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow" style={{ width: '75%' }}>
            <h2 className="text-2xl font-bold mb-4 text-center">Booking {venues.name}</h2>
            <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.first_name + " " + user.last_name}
                        onChange={handleChange}
                        required
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={user.phone}
                        readOnly
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="eventName" className="block text-gray-700 font-medium mb-2">Event Name</label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                {/* <div>
                    <label htmlFor="eventType" className="block text-gray-700 font-medium mb-2">Event Type</label>
                    <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="">Select an Event Type</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Party">Party</option>
                    </select>
                </div> */}
                <div>
                    <label htmlFor="eventType" className="block text-gray-700 font-medium mb-2">
                        Event Type
                    </label>
                    <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="">Select an Event Type</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="eventDate" className="block text-gray-700 font-medium mb-2">Event Date</label>
                    <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="startTime" className="block text-gray-700 font-medium mb-2">Start Time</label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-gray-700 font-medium mb-2">End Time</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="guests" className="block text-gray-700 font-medium mb-2">Number of Guests</label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="setup" className="block text-gray-700 font-medium mb-2">Preferred Setup</label>
                    <input
                        type="text"
                        id="setup"
                        name="setup"
                        value={formData.setup}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="catering" className="block text-gray-700 font-medium mb-2">Catering Services</label>
                    <select
                        id="catering"
                        name="catering"
                        value={formData.catering}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="avEquipment" className="block text-gray-700 font-medium mb-2">Audio/Visual Equipment</label>
                    <select
                        id="avEquipment"
                        name="avEquipment"
                        value={formData.avEquipment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="specialRequests" className="block text-gray-700 font-medium mb-2">Special Requests</label>
                    <textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border rounded-lg"
                    ></textarea>
                </div>
                {/* <div className="sm:col-span-2">
                    <label htmlFor="paymentMethod" className="block text-gray-700 font-medium mb-2">Payment Method</label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="">Select Payment Method</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Net Banking">Net Banking</option>
                    </select>
                </div> */}
                <div className="sm:col-span-2">
                    <label htmlFor="agreeToTerms" className="flex items-center">
                        <input
                            type="checkbox"
                            id="agreeToTerms"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-gray-700">I agree to the terms and conditions</span>
                    </label>
                </div>
                <button
                    type="submit"
                    onClick={handleProceedToPayment}
                    className="sm:col-span-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    Submit Booking
                </button>
            </form>
        </div>
    );
};

export default BookVenue;
