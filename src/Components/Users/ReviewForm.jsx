import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { message } from 'antd';

const ReviewForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get userId, bookingId, and previous page from state
    const { userId, bookingId, message: notificationMessage, notificationId } = location.state || {};

    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!newReview || rating === 0) {
            message.warning("Please provide both a rating and review text");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Submit the review
            const reviewResponse = await axios.post("https://84fa-115-98-235-107.ngrok-free.app/reviews/add", {
                userId,
                bookingId,
                rating,
                review: newReview
            });
            console.log("Review response:", reviewResponse.data);

            if (reviewResponse.data) {
                // If notificationId exists, delete the notification
                if (notificationId) {
                    try {
                        await axios.delete(`https://84fa-115-98-235-107.ngrok-free.app/notifications/delete/${notificationId}`);
                        message.success("Review submitted successfully!");
                    } catch (error) {
                        console.error("Error deleting notification:", error);
                        message.success("Review submitted, but couldn't clear notification");
                    }
                } 
                
                navigate("/venues");  // Redirect to bookings page
            } else {
                message.error("Failed to submit review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            message.error("An error occurred while submitting the review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
                <h4 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {notificationMessage}
                </h4>
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 mb-6"
                    rows="5"
                    placeholder="Share your experience..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                />
                <div className="flex items-center justify-center mb-6">
                    <span className="mr-3 text-lg text-gray-700 font-medium">
                        Your Rating:
                    </span>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                size={32}
                                className={`cursor-pointer transition-colors duration-200 ${
                                    (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                                }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md shadow transition-all duration-200 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 transform'
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
};

export default ReviewForm;