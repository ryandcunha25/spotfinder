CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY, -- Unique identifier for each payment
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE, -- Reference to the booking, deletes payment if booking is deleted
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Reference to the user, deletes payment if user is deleted
    amount DECIMAL(10, 2) NOT NULL, -- Amount paid
    payment_method VARCHAR(50) NOT NULL, -- Payment method (e.g., "Credit Card," "Razorpay")
    payment_status VARCHAR(50) DEFAULT 'Pending', -- Status (e.g., "Success," "Failed")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Payment timestamp
);
