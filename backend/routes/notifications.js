const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust the path based on your project structure
const authenticate = require('../middleware/authToken'); // Assuming you have authentication middleware
// const emails = require("./email_service"); // Ensure correct import
// const sendReviewRequestEmail = emails.sendReviewRequestEmail;

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        res.json(notifications.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Endpoint to insert a new notification
router.post("/add", async (req, res) => {
    const { user_id, bookingId, message, type } = req.body;

    if (!user_id || !message) {
        return res.status(400).json({ error: "User ID and message are required" });
    }

    try {
        const insertNotificationQuery = `
            INSERT INTO notifications (user_id, booking_id, message, type, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *;
        `;
        const result = await pool.query(insertNotificationQuery, [user_id, bookingId, message, type]);

        res.status(200).json({
            message: "Notification added successfully",
            notification: result.rows[0],
        });
    } catch (error) {
        console.error("Error adding notification:", error);
        res.status(500).json({ error: "Failed to add notification" });
    }
});

router.delete('/deleteall/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const deleteQuery = 'DELETE FROM notifications WHERE user_id = $1';
        await pool.query(deleteQuery, [userId]);

        res.status(200).json({ message: 'Notifications deleted successfully' });
    } catch (error) {
        console.error('Error deleting notifications:', error);
        res.status(500).json({ error: 'Failed to delete notifications' });
    }
})

router.delete('/delete/:notificationId', async (req, res) => {
    const { notificationId } = req.params;

    try {
        const deleteQuery = 'DELETE FROM notifications WHERE notification_id = $1';
        await pool.query(deleteQuery, [notificationId]);

        res.status(200).json({ message: 'Notifications deleted successfully' });
    } catch (error) {
        console.error('Error deleting notifications:', error);
        res.status(500).json({ error: 'Failed to delete notifications' });
    }
})

module.exports = router;