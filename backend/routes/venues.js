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


router.put("/edit-venue/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params; // Extract venue ID from URL
    const {
      name,
      location,
      capacity,
      price,
      contact,
      category,
      description,
      amenities,
      image
    } = req.body;

    if (!venueId) {
      return res.status(400).json({ error: "Venue ID is required" });
    }

    // Ensure categories and amenities are stored as arrays
    const formattedCategory = Array.isArray(category) ? category : category.split(",").map(cat => cat.trim());
    const formattedAmenities = Array.isArray(amenities) ? amenities : amenities.split(",").map(amenity => amenity.trim());

    // Update query
    const query = `
      UPDATE venues 
      SET name = $1, location = $2, capacity = $3, price = $4, contact = $5, 
          category = $6, description = $7, amenities = $8, image = $9
      WHERE venue_id = $10 
      RETURNING *;
    `;

    const values = [name, location, capacity, price, contact, formattedCategory, description, formattedAmenities, image, venueId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    res.json({ message: "Venue updated successfully", updatedVenue: result.rows[0] });

  } catch (error) {
    console.error("Error updating venue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete-venue/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params; // Extract venue ID from URL

    if (!venueId) {
      return res.status(400).json({ error: "Venue ID is required" });
    }

    // Check if venue exists
    const checkVenue = await pool.query("SELECT * FROM venues WHERE venue_id = $1", [venueId]);
    if (checkVenue.rows.length === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    // Delete the venue
    await pool.query("DELETE FROM venues WHERE venue_id = $1", [venueId]);

    res.json({ message: "Venue deleted successfully" });

  } catch (error) {
    console.error("Error deleting venue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

