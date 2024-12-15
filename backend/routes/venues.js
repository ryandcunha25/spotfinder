const express = require("express");
const router = express.Router();
const pool = require("../db"); // Adjust the path based on your project structure

// Fetching all venues
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM venues");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching venues:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Fetching individual venues
router.get('/:venueId', async (req, res) => {
  const { venueId } = req.params;
  console.log('Showing details of venueId = :', venueId);

  // Fetch the venue from your database
  try {
    const venue = await pool.query('SELECT * FROM venues WHERE venue_id = $1', [venueId]);
    if (venue.rows.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue.rows[0]);
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

