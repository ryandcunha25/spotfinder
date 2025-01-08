const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust the path to your database connection file
const authenticateToken = require('../middleware/authToken'); // To verify user token

// Add to wishlist
router.post('/add-to-wishlist', authenticateToken, async (req, res) => {
    const { venue_id } = req.body;
    const user_id = req.user.id; // Extract user_id from token

    console.log("Adding venueId -> "+venue_id+" to favourites of userId -> "+user_id)
    try {
        // Check if the combination already exists
        const checkQuery = 'SELECT * FROM favourites WHERE user_id = $1 AND venue_id = $2';
        const checkResult = await pool.query(checkQuery, [user_id, venue_id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ message: 'Venue already in wishlist' });
        }

        // Insert into favourites
        const insertQuery = 'INSERT INTO favourites (user_id, venue_id) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(insertQuery, [user_id, venue_id]);

        res.status(201).json({ message: 'Venue added to wishlist', favourite: result.rows[0] });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/wishlist', authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    console.log("Showing wishlist of current user: "+user_id)
    try {
        const query = `
            SELECT v.venue_id, v.name, v.image, v.description, v.price
            FROM venues AS v
            WHERE 
            v.venue_id IN (
                SELECT f.venue_id 
                FROM favourites AS f 
                WHERE f.user_id = $1
            );
        `;
        const result = await pool.query(query, [user_id]);
        res.json({ wishlist: result.rows });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove venue from wishlist
router.delete('/remove-from-wishlist', authenticateToken, async (req, res) => {
    const { venue_id } = req.body; // Get venue_id from the request body
    const user_id = req.user.id; // Get user_id from the token (decoded by authenticate middleware)
    console.log("Removing venueId -> "+venue_id+" from favourites of userId -> "+user_id)

    if (!venue_id) {
        return res.status(400).json({ message: 'Venue ID is required.' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM favourites WHERE user_id = $1 AND venue_id = $2 RETURNING *',
            [user_id, venue_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Venue not found in your wishlist.' });
        }

        res.status(200).json({ message: 'Venue removed from wishlist successfully.' });
    } catch (error) {
        console.error('Error removing venue from wishlist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
