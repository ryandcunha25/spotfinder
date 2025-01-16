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

// Endpoint to update booking status on successful payment
router.post('/update-booking-status', async (req, res) => {
    const { bookingId } = req.body; // Receive paymentId and bookingId from the frontend

    try {
        // Update the booking status to "Success"
        const updateQuery = `
        UPDATE bookings
        SET status = 'Success'
        WHERE booking_id = $1
        RETURNING *;
      `;
        const result = await pool.query(updateQuery, [bookingId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Optionally, you can log the payment details or any other required data
        console.log(`Booking status updated for booking id: ${bookingId}`);

        res.status(200).json({ message: 'Booking status updated successfully', booking: result.rows[0] });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});


router.get('/confirmed-booking', async (req, res) => {
    const { book_id } = req.query;
    console.log('Showing receipt of booked id:', book_id);
    try {
        const selectQuery = `
          SELECT venues.*, bookings.*, users.* FROM bookings
            JOIN venues ON bookings.venue_id = venues.venue_id
            JOIN users ON bookings.user_id = users.id
			where bookings.status = 'Success' and bookings.booking_id = $1
            ;
      `;
        const result = await pool.query(selectQuery, [book_id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
