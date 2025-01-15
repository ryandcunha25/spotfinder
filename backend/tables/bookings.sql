CREATE TABLE bookings (
    booking_id BIGINT PRIMARY KEY DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)::BIGINT, -- Unique identifier for each booking
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- References the id column in users table
    venue_id INTEGER REFERENCES venues(venue_id) ON DELETE CASCADE, -- References the venue_id column in venues table
    booking_date DATE NOT NULL, -- Date of the event
    start_time TIME NOT NULL, -- Start time of the booking
    end_time TIME NOT NULL, -- End time of the booking
    total_price DECIMAL(10, 2) NOT NULL, -- Total price of the booking
    status VARCHAR(50) DEFAULT 'Pending', -- Booking status (default is "Pending")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the booking was created
);
