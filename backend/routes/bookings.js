// bookings.js (backend route file)
const express = require('express');
const pool = require('../db'); // PostgreSQL connection pool
const router = express.Router();

router.post('/book', async (req, res) => {
    const {
        bookingId,
        userId,
        venueId,
        name,
        capacity,
        price,
        image,
        ratings,
        eventDate,
        startTime,
        endTime,
        eventName,
        eventType,
        guestCount,
        catering,
        avEquipment,
    } = req.body;
    try {
        const insertQuery = `
      INSERT INTO bookings (
        booking_id, user_id, venue_id, booking_date, start_time, end_time, 
        total_price, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', CURRENT_TIMESTAMP)
      RETURNING booking_id;
    `;

        const totalPrice = 0; // Replace with actual pricing logic

        const result = await pool.query(insertQuery, [
            bookingId,
            userId,
            venueId,
            eventDate,
            startTime,
            endTime,
            totalPrice,
        ]);

        res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully!',
            bookingId: result.rows[0].booking_id,
        });
    } catch (error) {
        console.error('Error inserting booking:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
