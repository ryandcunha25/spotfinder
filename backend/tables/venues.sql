CREATE TABLE venues (
    venue_id SERIAL PRIMARY KEY, -- Auto-incrementing ID for each venue
    name VARCHAR(255) NOT NULL, -- Name of the venue
    description TEXT, -- Detailed description of the venue
    owner VARCHAR(255), -- Name of the venue owner or manager
    location TEXT NOT NULL, -- Location/address of the venue
    capacity INTEGER CHECK (capacity >= 0), -- Capacity, must be a non-negative number
    price INTEGER, -- Price of the venue (added after capacity)
    image TEXT[], -- URL or path to the venue image
    amenities TEXT[], -- List of amenities (can be stored as a comma-separated string or JSON)
    contact VARCHAR(50), -- Contact number or email
    ratings DECIMAL(3, 1) CHECK (ratings >= 0 AND ratings <= 5), -- Ratings between 0 and 5 (can now accept decimals)
    reviews TEXT[] -- Array of reviews
);

INSERT INTO venues (name, description, owner, location, capacity, price, image, amenities, contact, ratings, reviews)
VALUES
('Grand Palace Banquet', 
 'A luxurious banquet hall perfect for weddings, receptions, and corporate events.', 
 'John Doe', 
 '1234 Elm Street, Springfield, IL', 
 300, 
 15000,  -- Price for Grand Palace Banquet
 '{"venue3.webp", "venue4.avif", "venue5.jpg", "venue9.jpeg", "venue10.jpeg", "venue11.jpeg"}', 
 '{"Parking", "Wi-Fi", "Air Conditioning", "Stage", "Projector"}', 
 '123-456-7890', 
 5, 
 '{"Excellent venue with great service", "Spacious and well-maintained"}'),

('Skyline Rooftop', 
 'An open-air rooftop venue offering stunning city views, ideal for parties and cocktail events.', 
 'Jane Smith', 
 '789 Main Avenue, Chicago, IL', 
 120, 
 12000,  -- Price for Skyline Rooftop
 '{"venue6.jpeg", "venue7.jpeg","venue8.jpeg"}', 
 '{"Bar", "Outdoor Seating", "Live Music", "Decor Services"}', 
 '987-654-3210', 
 4, 
 '{"Amazing views, highly recommend!", "A bit expensive, but worth it"}'),

('Countryside Pavilion', 
 'A serene countryside venue surrounded by nature, perfect for retreats and private gatherings.', 
 'Emily Brown', 
 '56 Lakeview Road, Oakwood, TX', 
 200, 
 90000,  -- Price for Countryside Pavilion
 '{"venue6.jpeg", "venue7.jpeg","venue8.jpeg"}', 
 '{"Lawn", "Parking", "Outdoor Catering", "Bonfire Setup"}', 
 '555-987-6543', 
 4, 
 '{"Peaceful and beautiful location", "The staff was very helpful"}');
