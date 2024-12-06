const express = require("express");
const router = express.Router();
const pool = require("../db"); // Adjust the path based on your project structure

// Endpoint to fetch venues
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM venues");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching venues:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
 