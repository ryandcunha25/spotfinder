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

router.get("/ownerspecific/:ownerId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId; // ✅ Extract ownerId correctly
    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    const result = await pool.query("SELECT * FROM venues WHERE owner_id = $1", [ownerId]);

    res.json(result.rows); // Send only venues belonging to the specific owner
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/add-venue", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      ownerId,
      name,
      location,
      capacity,
      price,
      contact,
      category,
      description,
      amenities,
      images,
    } = req.body;

    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    // Ensure category and amenities are stored as PostgreSQL arrays
    const formattedCategory = `{${category.map(cat => `"${cat}"`).join(",")}}`;
    const formattedAmenities = `{${amenities.map(amenity => `"${amenity}"`).join(",")}}`;

    const query = `
      INSERT INTO venues (owner_id, name, location, capacity, price, contact, category, description, amenities, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
    `;

    const values = [
      ownerId,
      name,
      location,
      capacity,
      price,
      contact,
      formattedCategory,
      description,
      formattedAmenities,
      images,
    ];

    const result = await client.query(query, values);

    console.log("Venue added successfully:", result.rows[0]);

    res.status(201).json({ message: "Venue added successfully!", venue: result.rows[0] });
  } catch (error) {
    console.error("Error adding venue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});


module.exports = router;

