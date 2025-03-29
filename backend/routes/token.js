const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authToken'); // Middleware for token authentication
const pool = require('../db'); // Database connection

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // Fetch user details based on the user ID from the token
        const userQuery = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(userQuery, [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// In your backend route file (e.g., routes/profile.js)
router.put('/edit-profile', authenticateToken, async (req, res) => {
    try {
        const { first_name, last_name, email, phone } = req.body;
        const userId = req.user.id;

        await pool.query(
            "UPDATE users SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4",
            [first_name, last_name, phone, userId]
          );
      
          res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
