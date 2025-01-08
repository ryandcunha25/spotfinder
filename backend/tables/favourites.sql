CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY, -- Unique ID for each favorite record
    user_id INT NOT NULL REFERENCES users(id), -- User who favorited the venue
    venue_id INT NOT NULL REFERENCES venues(venue_id), -- Favorited venue ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the venue was marked as favorite
);