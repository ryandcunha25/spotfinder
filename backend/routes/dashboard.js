const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection pool

// Get Total Bookings for a specific owner
router.get('/total-bookings/:ownerId', async (req, res) => {
    const { ownerId } = req.params;
    try {
        const result = await pool.query(
            `SELECT COUNT(*) AS total_bookings 
             FROM bookings 
             WHERE status = 'Success' AND venue_id IN 
             (SELECT venue_id FROM venues WHERE owner_id = $1)`, 
            [ownerId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get Upcoming Events for a specific owner
router.get('/upcoming-events/:ownerId', async (req, res) => {
    const { ownerId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM bookings 
             WHERE booking_date >= CURRENT_DATE AND status = 'Success' 
             AND venue_id IN (SELECT venue_id FROM venues WHERE owner_id = $1)
             ORDER BY booking_date ASC`,
            [ownerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get Monthly Revenue Summary for a specific owner
router.get('/revenue-summary/monthly/:ownerId', async (req, res) => {
    const { ownerId } = req.params;
    try {
        const result = await pool.query(
            `SELECT DATE_TRUNC('month', created_at) AS month, SUM(amount) AS total_revenue 
             FROM payments 
             WHERE payment_status = 'Success' AND booking_id IN 
             (SELECT booking_id FROM bookings WHERE venue_id IN 
             (SELECT venue_id FROM venues WHERE owner_id = $1))
             GROUP BY month ORDER BY month DESC`,
            [ownerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get Weekly Revenue Summary for a specific owner
router.get('/revenue-summary/weekly/:ownerId', async (req, res) => {
    const { ownerId } = req.params;
    try {
        const result = await pool.query(
            `SELECT DATE_TRUNC('week', created_at) AS week, SUM(amount) AS total_revenue 
             FROM payments 
             WHERE payment_status = 'Success' AND booking_id IN 
             (SELECT booking_id FROM bookings WHERE venue_id IN 
             (SELECT venue_id FROM venues WHERE owner_id = $1))
             GROUP BY week ORDER BY week DESC`,
            [ownerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get Pending Booking Requests for a specific owner
router.get('/pending-requests/:ownerId', async (req, res) => {
    const { ownerId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM bookings 
             WHERE status = 'pending' AND venue_id IN 
             (SELECT venue_id FROM venues WHERE owner_id = $1)
             ORDER BY booking_date ASC`,
            [ownerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get Recent Customer Feedback for a specific owner
router.get('/customer-feedback/:ownerId', async (req, res) => {
    const { ownerId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM reviews 
             WHERE booking_id IN 
             (SELECT booking_id FROM bookings WHERE venue_id IN 
             (SELECT venue_id FROM venues WHERE owner_id = $1))
             ORDER BY created_at DESC 
             LIMIT 10`,
            [ownerId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;