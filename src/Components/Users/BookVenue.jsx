import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { StarIcon } from "@heroicons/react/24/solid";

const BookVenue = () => {
    const location = useLocation();
    const { venueId } = location.state || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        eventName: "",
        eventType: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        guests: "",
        setup: "",
        catering: "No",
        avEquipment: "No",
        decoration: "No",
        stageSetup: "No",
        specialRequests: "",
        paymentMethod: "",
        alternateContact: "",
        agreeToTerms: false,
    });

    const [venues, setVenues] = useState(null);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });
    
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showSummary, setShowSummary] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookedSlots, setBookedSlots] = useState([]);


    useEffect(() => {
        async function fetchVenueDetails() {
            try {
                const response = await fetch(`http://localhost:5000/venues/${venueId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.category);
                    setVenues(data);
                    setTotalPrice(data.price); // Initialize with base price
                } else {
                    console.error("Failed to fetch venue details");
                }
            } catch (error) {
                console.error("Error fetching venue details:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchVenueDetails();
    }, [venueId]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("User is not authenticated");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/token/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Unable to fetch user details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "guests") {
            if (Number(value) > venues?.capacity) {
                alert(`Guest count cannot exceed the venue capacity of ${venues.capacity}`);
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const calculateTotalPrice = () => {
        let calculatedPrice = venues?.price || 0;

        // Add additional service charges
        if (formData.catering === "Yes") calculatedPrice += 5000;
        if (formData.avEquipment === "Yes") calculatedPrice += 3000;
        if (formData.decoration === "Yes") calculatedPrice += 4000;
        if (formData.stageSetup === "Yes") calculatedPrice += 6000;

        setTotalPrice(calculatedPrice);
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [formData.catering, formData.avEquipment, formData.decoration, formData.stageSetup]);

    const now = new Date();
    const minDate = now.toISOString().split("T")[0];
    const minTime = now.toTimeString().slice(0, 5);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.agreeToTerms) {
            alert("Please agree to the terms and conditions");
            return;
        }

        if (!isSlotAvailable()) {
            alert("This time slot is already booked. Please choose a different date or time.");
            return;
        }

        setShowSummary(true);
    };

    // Add this to your useEffect for fetching venue details
    useEffect(() => {
        async function fetchBookedSlots() {
            try {
                const response = await fetch(`http://localhost:5000/bookings/venue-booked-dates/${venueId}`);
                if (response.status == 200) {
                    const data = await response.json();
                    setBookedSlots(data);
                    console.log(data)
                }
            } catch (error) {
                console.error("Error fetching booked slots:", error);
            }
        }
        fetchBookedSlots();
    }, [venueId]);

    const isSlotAvailable = () => {
        if (!formData.eventDate || !formData.startTime || !formData.endTime) {
            return true; 
        }
    
        const selectedDate = formData.eventDate; 
        const selectedStart = formData.startTime; 
        const selectedEnd = formData.endTime; 
    
        return !bookedSlots.some(slot => {
            // Convert slot booking date to "YYYY-MM-DD" for accurate comparison
            const slotDate = new Date(slot.booking_date).toISOString().split('T')[0];
    
            // Check if selected date matches booked date
            if (slotDate !== selectedDate) {
                console.log("Slot Date:", slotDate, "| Selected Date:", selectedDate);
                return false; 
            }
    
    
            // Function to convert time "HH:MM" or "HH:MM:SS" into total minutes
            const toMinutes = (time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };
    
            const slotStart = toMinutes(slot.start_time);
            const slotEnd = toMinutes(slot.end_time);
            const selectedStartMin = toMinutes(selectedStart);
            const selectedEndMin = toMinutes(selectedEnd);
    
            // **Corrected Condition for Time Overlap**
            const isOverlapping = !(selectedEndMin <= slotStart || selectedStartMin >= slotEnd);
            
            isOverlapping ? console.log("Time Overlap - Slot Not Available") : console.log("No Overlap - Slot Available");
    
            return isOverlapping; // If true, means the slot is already booked
        });
    };
    


    const handleConfirmBooking = async () => {
        if (!isSlotAvailable()) {
            alert("This time slot has been booked by someone else. Please choose a different date or time.");
            setShowSummary(false);
            return;
        }

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            setError("User is not authenticated");
            return;
        }

        const bookingDetails = {
            bookingId: parseInt(Date.now()),
            userId: user.id,
            venueId: venues.venue_id,
            name: venues.name,
            capacity: venues.capacity,
            price: totalPrice,
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
            decoration: formData.decoration,
            stageSetup: formData.stageSetup,
            specialRequests: formData.specialRequests,
            alternateContact: formData.alternateContact,
            paymentMethod: formData.paymentMethod,
        };


        try {
            const response = await axios.post("http://localhost:5000/bookings/book", bookingDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                navigate("/bookings", { state: { bookingDetails } });
                alert("Your booking request has been sent successfully!");
            } else {
                setError("Failed to submit booking");
            }
        } catch (error) {
            console.error("Error submitting booking:", error);
            setError("Internal Server Error");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!venues) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Book Your Venue</h1>
                    <p className="mt-2 text-lg text-gray-600">Complete the form below to reserve {venues.name}</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8">
                    <div className={`flex flex-col items-center ${!showSummary ? 'text-blue-600' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!showSummary ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'}`}>
                            1
                        </div>
                        <span className="mt-2 text-sm font-medium">Booking Details</span>
                    </div>
                    <div className="flex-1 flex items-center px-2">
                        <div className={`w-full h-1 ${!showSummary ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className={`flex flex-col items-center ${showSummary ? 'text-blue-600' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showSummary ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'}`}>
                            2
                        </div>
                        <span className="mt-2 text-sm font-medium">Confirmation</span>
                    </div>
                </div>

                {!showSummary ? (
                    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl overflow-hidden">
                        <div className="p-6 space-y-6">
                            {/* User & Contact Details */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={`${user.first_name} ${user.last_name}`}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={user.phone}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact (Optional)</label>
                                        <input
                                            type="text"
                                            name="alternateContact"
                                            value={formData.alternateContact}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Venue Details */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Venue Details</h2>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={require(`../Assets/${venues.image[0]}`)}
                                            alt={venues.name}
                                            className="w-48 h-48 rounded-lg object-cover shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900">{venues.name}</h3>
                                        <div className="flex items-center mt-1">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon
                                                        key={star}
                                                        className={`h-5 w-5 ${star <= Math.floor(venues.ratings) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="ml-2 text-gray-600">{venues.ratings} ({venues.review_count || 0} reviews)</span>
                                        </div>
                                        <p className="mt-2 text-gray-600">{venues.location}</p>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Capacity</p>
                                                <p className="font-medium">{venues.capacity} people</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Base Price</p>
                                                <p className="font-medium">₹{venues.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                                        <input
                                            type="text"
                                            name="eventName"
                                            value={formData.eventName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                        <select
                                            name="eventType"
                                            value={formData.eventType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select an Event Type</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                        <input
                                            type="date"
                                            name="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleChange}
                                            min={minDate}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {formData.eventDate && !isSlotAvailable() && (
                                            <p className="mt-1 text-sm text-red-600">This date has conflicting bookings</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                                        <input
                                            type="number"
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleChange}
                                            min="1"
                                            max={venues.capacity}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            min={formData.eventDate === minDate ? minTime : "00:00"}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {formData.startTime && !isSlotAvailable() && (
                                            <p className="mt-1 text-sm text-red-600">This time slot is already booked</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            min={formData.startTime}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {formData.endTime && !isSlotAvailable() && (
                                            <p className="mt-1 text-sm text-red-600">This time slot is already booked</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Setup</label>
                                        <input
                                            type="text"
                                            name="setup"
                                            value={formData.setup}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="E.g., Theater style, Classroom style, etc."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Services */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Services</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Catering Services (+₹5000)</label>
                                        <select
                                            name="catering"
                                            value={formData.catering}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">A/V Equipment (+₹3000)</label>
                                        <select
                                            name="avEquipment"
                                            value={formData.avEquipment}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Decoration (+₹4000)</label>
                                        <select
                                            name="decoration"
                                            value={formData.decoration}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage Setup (+₹6000)</label>
                                        <select
                                            name="stageSetup"
                                            value={formData.stageSetup}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="pb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                <textarea
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Any special requirements or notes..."
                                ></textarea>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                                        I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">terms and conditions</a>
                                    </label>
                                    <p className="text-gray-500">By proceeding, you agree to our cancellation policy and venue rules.</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Estimated Total</p>
                                <p className="text-xl font-bold text-gray-900">₹{totalPrice}</p>
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Proceed
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                        {/* Booking Summary Header */}
                        <div className="bg-blue-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Booking Summary</h2>
                            <p className="text-blue-100">Review your booking details before confirmation</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Venue Summary */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Venue Details</h3>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={require(`../Assets/${venues.image[0]}`)}
                                            alt={venues.name}
                                            className="w-32 h-32 rounded-lg object-cover shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-gray-900">{venues.name}</h4>
                                        <p className="text-gray-600">{venues.location}</p>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Event Date</p>
                                                <p className="font-medium">{formData.eventDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Timing</p>
                                                <p className="font-medium">{formData.startTime} - {formData.endTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Guests</p>
                                                <p className="font-medium">{formData.guests} people</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Event Type</p>
                                                <p className="font-medium">{formData.eventType}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                    {formData.alternateContact && (
                                        <div>
                                            <p className="text-sm text-gray-500">Alternate Contact</p>
                                            <p className="font-medium">{formData.alternateContact}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Services Summary */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Base Venue Price</span>
                                        <span className="font-medium">₹{venues.price}</span>
                                    </div>
                                    {formData.catering === "Yes" && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Catering Services</span>
                                            <span className="font-medium">₹5000</span>
                                        </div>
                                    )}
                                    {formData.avEquipment === "Yes" && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">A/V Equipment</span>
                                            <span className="font-medium">₹3000</span>
                                        </div>
                                    )}
                                    {formData.decoration === "Yes" && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Decoration</span>
                                            <span className="font-medium">₹4000</span>
                                        </div>
                                    )}
                                    {formData.stageSetup === "Yes" && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Stage Setup</span>
                                            <span className="font-medium">₹6000</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Total Amount</span>
                                            <span className="font-bold text-lg">₹{totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            {formData.specialRequests && (
                                <div className="pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Requests</h3>
                                    <p className="text-gray-700">{formData.specialRequests}</p>
                                </div>
                            )}


                        </div>

                        {/* Summary Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <button
                                onClick={() => setShowSummary(false)}
                                className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                                Back to Edit
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                className="px-6 py-3 font-medium rounded-lg shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                                Send Booking Request
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookVenue;