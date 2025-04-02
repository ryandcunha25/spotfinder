const express = require("express");
const router = express.Router();
const pool = require("../db"); // PostgreSQL connection pool

// 1️⃣ Get Featured Venues (Top Rated / Recently Added)
router.get("/featured-venues", async (req, res) => {
    try {
        const result = await pool.query(`
           SELECT v.*, AVG(r.rating) AS avg_rating
            FROM venues v
            JOIN bookings b ON v.venue_id = b.venue_id
            JOIN reviews r ON b.booking_id = r.booking_id
            GROUP BY v.venue_id, v.name
            ORDER BY avg_rating DESC
            LIMIT 3;
            
            `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// 2️⃣ Search Venues with Filters
router.get("/search", async (req, res) => {
    const { location, event_type, capacity, min_price, max_price } = req.query;
    
    try {
        const result = await pool.query(`
            SELECT * FROM venues 
            WHERE ($1 IS NULL OR location ILIKE '%' || $1 || '%') 
            AND ($2 IS NULL OR event_type = $2) 
            AND ($3 IS NULL OR capacity >= $3) 
            AND ($4 IS NULL OR price >= $4) 
            AND ($5 IS NULL OR price <= $5)
            ORDER BY created_at DESC
            `, [location, event_type, capacity, min_price, max_price]);
            
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json("Server Error");
        }
    });
    
// 3️⃣ Get Venue Details by ID
router.get("/venue/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const venueDetails = await pool.query(`SELECT * FROM venues WHERE id = $1`, [id]);
        const reviews = await pool.query(`
            SELECT r.*, u.first_name, u.last_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.venue_id = $1
            ORDER BY r.created_at DESC
        `, [id]);

        if (venueDetails.rows.length === 0) {
            return res.status(404).json({ message: "Venue not found" });
        }

        res.json({
            venue: venueDetails.rows[0],
            reviews: reviews.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// 4️⃣ Get Recent Customer Testimonials (Reviews)
router.get("/testimonials", async (req, res) => {
    try {
        const result = await pool.query(`
           SELECT r.*, v.name AS venue_name FROM reviews r
            JOIN bookings b ON r.booking_id = b.booking_id
            JOIN venues v ON b.venue_id = v.venue_id
            WHERE r.rating = (SELECT MAX(rating) FROM reviews)
            ORDER BY r.created_at DESC
            LIMIT 5;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// 5️⃣ Get Venue Owners Who Recently Registered
router.get("/new-venue-owners", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, email, created_at 
            FROM venueowners 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// 6️⃣ Handle Contact Form Submission
router.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await pool.query(`
            INSERT INTO contact_messages (name, email, message, created_at)
            VALUES ($1, $2, $3, NOW())
        `, [name, email, message]);

        res.json({ success: true, message: "Message sent successfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;
