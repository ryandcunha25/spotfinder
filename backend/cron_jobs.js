const cron = require("node-cron");
const pool = require("./db"); // Import PostgreSQL connection

// Helper function to log messages with a timestamp (DD-MM-YYYY HH-MM)
function logWithTimestamp(message) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const yyyy = now.getFullYear();
  const HH = String(now.getHours()).padStart(2, "0");
  const MM = String(now.getMinutes()).padStart(2, "0");
  const timestamp = `${dd}-${mm}-${yyyy} ${HH}-${MM}`;
  console.log(`[${timestamp}]:  ${message}`);
}

// Run every hour (adjust the cron expression as needed)
cron.schedule("0 * * * *", async () => {
  logWithTimestamp("Checking for past bookings using cron_jobs...");
  try {
    // Fetch bookings where the booking date/time has passed and the user hasn't received a review request
    const result = await pool.query(
      `SELECT v.*, b.*, u.*
       FROM bookings b
       JOIN venues v ON b.venue_id = v.venue_id
       JOIN users u ON b.user_id = u.id
       WHERE ((b.booking_date < CURRENT_DATE)
              OR (b.booking_date = CURRENT_DATE AND b.end_time < CURRENT_TIME))
             AND u.id NOT IN (
               SELECT user_id FROM notifications WHERE type = 'Review_Request'
             );`
    );

    const bookings = result.rows; // Assuming the query returns an object with a "rows" array

    if (bookings.length > 0) {
      logWithTimestamp(`Found ${bookings.length} bookings that need a review request.`);
      for (let row of bookings) {
        // Adjust the field name for the venue name as per your schema (e.g., row.venue_name)
        const venueName = row.venue_name || row.name || "the venue";

        const insertQuery = `
          INSERT INTO notifications (user_id, booking_id, message, type, is_read, created_at)
          VALUES ($1, $2, $3, $4, false, NOW());
        `;

        await pool.query(insertQuery, [
          row.user_id,
          row.booking_id,
          "Please leave a review for your recently booked venue: " + venueName,
          "Review_Request"
        ]);

        logWithTimestamp("Review request notification sent for venue: " + venueName);
      }
    } else {
      logWithTimestamp("No past bookings need review requests.");
    }
  } catch (error) {
    logWithTimestamp("Error sending review request notifications: " + error.message);
    console.error(error);
  }
});


// Function to delete expired OTPs
const deleteExpiredOtps = async () => {
  try {
    const query = "DELETE FROM otp_verifications WHERE otp_expires_at <= NOW()";
    await pool.query(query);
    console.log(`[${new Date().toISOString()}] Expired OTPs deleted successfully.`);
  } catch (error) {
    console.error('Error deleting expired OTPs:', error);
  }
};

// Schedule the job to run every minute
cron.schedule('* * * * *', () => {
  console.log('Running OTP cleanup job...');
  deleteExpiredOtps();
});

