import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import {message} from 'antd';


const ReviewForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get userId, bookingId, and previous page from state
    const { userId, bookingId, message } = location.state || {};

    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);

    const handleSubmit = async () => {
        try {
          const response = await fetch("http://localhost:5000/reviews/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, bookingId, rating, review: newReview }),
          });
      
          // Parse the response as JSON
          const data = await response.json();
      
          if (response.ok) {
            message.success("Review submitted successfully!");
            navigate("/venues");  // Redirect to the specified page
          } else {
            console.error("Failed to submit review:", data);
            message.error("Failed to submit review.");
          }
        } catch (error) {
          console.error("Error submitting review:", error);
          message.error("An error occurred while submitting the review.");
        }
      };
      

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
                <h4 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {message}
                </h4>
                {/* {userId && (
                    <p className="text-center text-sm text-gray-600 mb-4">
                        Logged in as{" "}
                        <span className="font-semibold text-gray-800">{userId}</span>
                    </p>
                )} */}
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
                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md shadow transform hover:scale-105 transition-transform duration-200"
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default ReviewForm;
