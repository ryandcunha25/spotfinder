const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
require('dotenv').config();
const emails = require("./email_service");
const EmailOwnerID = emails.EmailOwnerID;

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Login route
router.post("/login", async (req, res) => {
  const { ownerId, password } = req.body;

  try {
    // Check if the owner exists
    const result = await pool.query("SELECT * FROM venue_owners WHERE owner_id = $1", [ownerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const owner = result.rows[0];

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { ownerId: owner.owner_id, email: owner.email }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: '1h' } // Token expiry (adjust as needed)
    );

    // Successful login
    res.status(200).json({
      message: "Login successful",
      token,
      ownerDetails: {
        ownerId: owner.owner_id,
        fullName: owner.full_name,
        email: owner.email,
        phone: owner.phone
      }
    });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Venue Owner Signup
router.post('/register', async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            fullName, email, phone, password, venueName,
            venueDescription, location, capacity, price,
            amenities, contact, category, images
        } = req.body;

        let ownerId;
        let isUnique = false;

        while (!isUnique) {
            ownerId = Math.floor(100000 + Math.random() * 900000);
            const idCheck = await client.query('SELECT owner_id FROM venue_owners WHERE owner_id = $1', [ownerId]);
            if (idCheck.rowCount === 0) isUnique = true;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const ownerQuery = `
            INSERT INTO venue_owners (owner_id, full_name, email, phone, password)
            VALUES ($1, $2, $3, $4, $5) RETURNING owner_id;
        `;
        await client.query(ownerQuery, [ownerId, fullName, email, phone, hashedPassword]);

        const formattedCategory = `{${category.join(',')}}`;
        const formattedImages = `{${images.join(',')}}`;

        const venueQuery = `
        INSERT INTO venues (name, location, capacity, price, description, amenities, contact, category, image, owner_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        await pool.query(venueQuery, [
          venueName, location, capacity, price, venueDescription,
          amenities, contact, formattedCategory, formattedImages, ownerId,
        ]);
        
        await EmailOwnerID(ownerId, email, fullName);

        res.status(201).json({ message: 'Venue owner and venue registered successfully!' });
    } catch (error) {
        console.error('Error registering venue owner:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});




// Export the router
module.exports = router;
