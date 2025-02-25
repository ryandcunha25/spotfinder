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
        specialRequests
    } = req.body;
    try {
        const insertQuery = `
      INSERT INTO bookings (
        booking_id, event_name, event_type, user_id, venue_id, booking_date, start_time, end_time, 
        total_price, special_requests, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,'Pending', CURRENT_TIMESTAMP)
      RETURNING booking_id;
    `;

        const totalPrice = 0; // Replace with actual pricing logic

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
            specialRequests
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
    console.log(booking_id)
    const { status } = req.body;

    try {
        // Update the booking status to "Success"
        //     const query = `
        //     UPDATE bookings
        //     SET status = $1, payment_method = $2
        //     WHERE booking_id = $3
        //     RETURNING *;
        // `;
        //     const result = await pool.query(query, ['Success', paymentMethod, bookingId]);
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

router.get('/show-bookings', authenticateToken, async (req, res) => {
    try {
        // const userId = req.user.id; // Get the userId from the token
        const userId = req.user.id;
        // const { userId } = req.body;
        // console.log("Received userId:", userId, "Type:", typeof userId);


        // const query = await pool.query(`Select * from bookings`)

        const result = await pool.query(
            `SELECT b.*, u.*, v.* FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN venues v ON b.venue_id = v.venue_id
            WHERE b.user_id = $1;
            `,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// venue owners side

// Fetch all bookings with user and venue details
router.get("/showallbookings/:ownerId", async (req, res) => {
    try {
        const { ownerId } = req.params;
        const query = `
            SELECT v.*, b.*, u.*, p.*
            FROM venues v
            LEFT JOIN bookings b ON v.venue_id = b.venue_id
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN payments p ON b.booking_id = p.booking_id
            WHERE v.owner_id = $1;
        `;

        const result = await pool.query(query, [ownerId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
