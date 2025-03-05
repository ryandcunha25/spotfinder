const cron = require("node-cron");
const pool = require("./db"); // Import your PostgreSQL database connection
const { sendReviewRequestEmail } = require("./routes/email_service");

// Schedule job to run every hour to check completed bookings
cron.schedule("0 * * * *", async () => {
    console.log("Checking for completed bookings...");

    try {
        const currentDateTime = new Date();

        // Fetch bookings where the booking time has passed
        const result = await pool.query(
            `SELECT v.*, b.*, u.*
            FROM bookings b
            JOIN venues v ON b.venue_id = v.venue_id
            JOIN users u ON b.user_id = u.id
            WHERE (b.booking_date < CURRENT_DATE)
            OR (b.booking_date = CURRENT_DATE AND b.end_time < CURRENT_TIME); `
        );

        if (result.rows.length === 0) {
            console.log("No completed bookings found.");
            return;
        }

        // Send review request email for each completed booking
        for (const booking of result.rows) {
            await sendReviewRequestEmail(booking.email, booking.first_name, booking.name, booking.booking_id);

            // Update database to mark review email as sent
            // await pool.query(`UPDATE bookings SET review_sent = true WHERE id = $1`, [booking.id]);

            console.log(`Review request email sent to ${booking.user_email}`);
        }
    } catch (error) {
        console.error("Error checking bookings:", error);
    }
});

console.log("Cron job for sending review emails is running...");
