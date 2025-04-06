// bookings.js (backend route file)
const express = require('express');
const pool = require('../db'); // PostgreSQL connection pool
const router = express.Router();
const authenticateToken = require('../middleware/authToken'); // To verify user token


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
        decoration,
        stageSetup,
        specialRequests
    } = req.body;
    try {
        const insertQuery = `
      INSERT INTO bookings (
        booking_id, event_name, event_type, user_id, venue_id, booking_date, start_time, end_time, 
        total_price, special_requests, guests, catering, avEquipment, decoration, stageSetup, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'Pending', CURRENT_TIMESTAMP)
      RETURNING booking_id;
    `;


        const result = await pool.query(insertQuery, [
            bookingId,
            eventName,
            eventType,
            userId,
            venueId,
            eventDate,
            startTime,
            endTime,
            price,
            specialRequests,
            guestCount,
            catering,
            avEquipment,
            decoration,
            stageSetup
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
router.put("/update-booking-status/:booking_id", async (req, res) => {
    // const { bookingId, paymentMethod } = req.body; // Receive paymentId and bookingId from the frontend
    const { booking_id } = req.params;
    console.log("Received booking id:", booking_id);
    const { status } = req.body;

    try {
        const updateQuery = `
            UPDATE bookings
            SET status = $1
            WHERE booking_id = $2
            RETURNING *;
        `;
        const result = await pool.query(updateQuery, [status, booking_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Optionally, you can log the payment details or any other required data
        console.log(`Booking status updated for booking id: ${booking_id}`);

        res.status(200).json({
            message: 'Booking status updated successfully',
            booking: result.rows[0],
        });

    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

// Endpoint to fetch booking details for confirmation page
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

// showing bookings for users

router.get('/show-bookings/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT b.*, u.*, v.* FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN venues v ON b.venue_id = v.venue_id
            WHERE b.user_id = $1;
            `,
            [req.params.userId]
        );
        console.log(result.rows);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route to get all bookings for a specific venue
router.get("/venue-booked-dates/:venueId", async (req, res) => {
    const { venueId } = req.params;

    try {
        const result = await pool.query(
            `SELECT b.*, u.*, p.* FROM bookings b
             JOIN users u ON b.user_id = u.id
             LEFT JOIN payments p ON b.booking_id = p.booking_id
             WHERE b.venue_id = $1`,
            [venueId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// venue owners side

// Fetch all bookings with user and venue details
router.get("/showallbookings/:ownerId", async (req, res) => {
    try {
        const { ownerId } = req.params;
        const query = `
            SELECT b.*, v.*, u.*
            FROM venues v
            JOIN bookings b ON v.venue_id = b.venue_id
            JOIN users u ON b.user_id = u.id
            WHERE v.owner_id = $1
            order by b.created_at desc;

        `;

        const result = await pool.query(query, [ownerId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
