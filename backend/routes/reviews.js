const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path based on your project structure
const authenticate = require('../middleware/authToken'); // Assuming you have authentication middleware
// const emails = require("./email_service"); // Ensure correct import
// const sendReviewRequestEmail = emails.sendReviewRequestEmail;

const { sendReviewRequestEmail } = require("./email_service");

console.log(sendReviewRequestEmail);
// Fetch all reviews for a specific venue
router.get('/:venueId', async (req, res) => {
    const { venueId } = req.params;

    const query = `
        SELECT 
        u.*,
        r.*,
        b.*
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN bookings b ON r.booking_id = b.booking_id
        WHERE b.venue_id = $1
        ORDER BY r.created_at DESC;
        `
    try {
        const reviews = await db.query(query, [venueId]);
        res.json(reviews.rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Add a review (only authenticated users)
router.post('/add',  async (req, res) => {
    const { userId, bookingId, review, rating } = req.body;
    // userId = req.user.id; // Retrieved from authentication middleware

    if (!review.trim()) {
        return res.status(400).json({ message: 'Review cannot be empty' });
    }

    try {
        const newReview = await db.query(
            'INSERT INTO reviews (user_id, booking_id, review_text, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, bookingId, review, rating]
        );
        res.status(200).json(newReview.rows[0]);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST endpoint to send review request notifications for past bookings
router.post("/send-review-requests", async (req, res) => {
    console.log("Checking for past bookings...");
    try {
        // Fetch bookings where the booking time has passed
        const result = await db.query(
            `SELECT v.*, b.*, u.*
            FROM bookings b
            JOIN venues v ON b.venue_id = v.venue_id
            JOIN users u ON b.user_id = u.id
            WHERE ((b.booking_date < CURRENT_DATE)
                    OR (b.booking_date = CURRENT_DATE AND b.end_time < CURRENT_TIME))
                AND u.id NOT IN (
                select user_id from notifications where type = 'Review_Request'
                ); `

        );

        if (result.rows.length > 0) {
            console.log(`Found ${result.rows.length} bookings that need a review request.`);

            for (let row of result.rows) {
                const insertQuery = `
                    INSERT INTO notifications (user_id, booking_id, message, type, created_at)
                    VALUES ($1, $2, $3, $4, NOW());
                `;
                await db.query(insertQuery, [
                    row.user_id,
                    row.booking_id,
                    "Please leave a review for your recently booked venue: " + row.name,
                    "Review_Request"
                ]);
                console.log("Review request notification sent for venue: "+row.name);
            }
            return res.status(200).json({ message: `Review request notifications sent for ${result.rows.length} bookings.` });
        } else {
            console.log("No past bookings need review requests.");
            return res.status(200).json({ message: "No past bookings need review requests." });
        }
    } catch (error) {
        console.error("Error sending review request notifications:", error);
        return res.status(500).json({ error: "Failed to send review request notifications." });
    }
}); 

// Fetch reviews for a venue owned by the logged-in owner
router.get('/owner/:owner_id', async (req, res) => {
    const { owner_id } = req.params;

    try {
        const query = `
            SELECT r.*, u.*, v.* FROM reviews r
            JOIN bookings b ON r.booking_id = b.booking_id
            JOIN venues v ON b.venue_id = v.venue_id
            JOIN users u ON r.user_id = u.id
            WHERE v.owner_id = $1;

        `;

        const result = await db.query(query, [owner_id]);
        res.status(200).json({ success: true, reviews: result.rows });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Optional: Allow owner to respond to a review
router.post('/owner/reply', async (req, res) => {
    const { review_id, owner_id, reply } = req.body;

    try {
        // Ensure that the review belongs to a venue owned by the owner
        const checkQuery = `
            SELECT r.id FROM reviews r
            JOIN venues v ON r.venue_id = v.id
            WHERE r.id = $1 AND v.owner_id = $2;
        `;
        const checkResult = await pool.query(checkQuery, [review_id, owner_id]);

        if (checkResult.rowCount === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        // Insert the owner's reply
        const insertQuery = `INSERT INTO review_replies (review_id, owner_id, reply) VALUES ($1, $2, $3) RETURNING *;`;
        const result = await pool.query(insertQuery, [review_id, owner_id, reply]);

        res.json({ success: true, message: "Reply added successfully", reply: result.rows[0] });
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});




module.exports = router;
