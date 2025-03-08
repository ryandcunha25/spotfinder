// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Total Bookings per Venue
router.get('/totalBookingsPerVenue', async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const query = `
      SELECT 
        v.venue_id,
        v.name,
        COUNT(b.booking_id) AS total_bookings
      FROM venues v
      LEFT JOIN bookings b ON v.venue_id = b.venue_id
      WHERE v.owner_id = $1
      GROUP BY v.venue_id, v.name;
    `;
    const result = await pool.query(query, [ownerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Total Revenue per Venue (Using Bookings Data)
router.get('/totalRevenueByBookings', async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const query = `
      SELECT 
        v.venue_id,
        v.name,
        COALESCE(SUM(b.total_price), 0) AS total_revenue
      FROM venues v
      LEFT JOIN bookings b ON v.venue_id = b.venue_id
      WHERE v.owner_id = $1
      GROUP BY v.venue_id, v.name;
    `;
    const result = await pool.query(query, [ownerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Total Revenue per Venue (Using Payments Data)
router.get('/totalRevenueByPayments', async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const query = `
      SELECT 
        v.venue_id,
        v.name,
        COALESCE(SUM(p.amount), 0) AS total_revenue
      FROM venues v
      LEFT JOIN bookings b ON v.venue_id = b.venue_id
      LEFT JOIN payments p ON b.booking_id = p.booking_id
      WHERE v.owner_id = $1 
        AND p.payment_status = 'Success'
      GROUP BY v.venue_id, v.name;
    `;
    const result = await pool.query(query, [ownerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Average Rating and Total Reviews per Venue
router.get('/ratingsAndReviews', async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const query = `
      SELECT 
        v.venue_id,
        v.name,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.review_id) AS total_reviews
      FROM venues v
      LEFT JOIN bookings b ON v.venue_id = b.venue_id
      LEFT JOIN reviews r ON b.booking_id = r.booking_id
      WHERE v.owner_id = $1
      GROUP BY v.venue_id, v.name;
    `;
    const result = await pool.query(query, [ownerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Booking Trends by Month
router.get('/bookingTrends', async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const query = `
      SELECT 
        DATE_TRUNC('month', b.booking_date) AS month,
        COUNT(*) AS bookings_count
      FROM bookings b
      JOIN venues v ON b.venue_id = v.venue_id
      WHERE v.owner_id = $1
      GROUP BY DATE_TRUNC('month', b.booking_date)
      ORDER BY month;
    `;
    const result = await pool.query(query, [ownerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Payment Trends by Month
router.get('/paymentTrends', async (req, res) => {
  try {
    const ownerId = req.query.ownerId;
    const query = `
      SELECT 
        DATE_TRUNC('month', p.created_at) AS month,
        COUNT(*) AS payment_count,
        COALESCE(SUM(p.amount), 0) AS total_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN venues v ON b.venue_id = v.venue_id
      WHERE v.owner_id = $1 
        AND p.payment_status = 'Success'
      GROUP BY DATE_TRUNC('month', p.created_at)
      ORDER BY month;
    `;
    const result = await pool.query(query, [ownerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// 7. Payment Method Distribution
router.get('/paymentMethodDistribution', async (req, res) => {
    const ownerId = req.query.ownerId;
    try {
      const query = `
        SELECT 
          p.payment_method,
          COUNT(*) AS method_count
        FROM payments p
        JOIN bookings b ON p.booking_id = b.booking_id
        JOIN venues v ON b.venue_id = v.venue_id
        WHERE v.owner_id = $1 
          AND p.payment_status = 'Success'
        GROUP BY p.payment_method;
      `;
      const result = await pool.query(query, [ownerId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query error' });
    }
  });
  
  // 8. Popular Event Types
  router.get('/popularEventTypes', async (req, res) => {
    const ownerId = req.query.ownerId;
    try {
      const query = `
        SELECT 
          b.event_type,
          COUNT(*) AS event_count
        FROM bookings b
        JOIN venues v ON b.venue_id = v.venue_id
        WHERE v.owner_id = $1
        GROUP BY b.event_type
        ORDER BY event_count DESC;
      `;
      const result = await pool.query(query, [ownerId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query error' });
    }
  });
  
  // 9. User Engagement - Total Reviews and Average Rating (Overall)
  router.get('/userEngagement', async (req, res) => {
    const ownerId = req.query.ownerId;
    try {
      const query = `
        SELECT 
          COUNT(*) AS total_reviews, 
          COALESCE(AVG(r.rating), 0) AS average_rating
        FROM reviews r
        JOIN bookings b ON r.booking_id = b.booking_id
        JOIN venues v ON b.venue_id = v.venue_id
        WHERE v.owner_id = $1;
      `;
      const result = await pool.query(query, [ownerId]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query error' });
    }
  });
  
  // 10. Cancellation Rate per Venue (Percentage)
  router.get('/cancellationRate', async (req, res) => {
    const ownerId = req.query.ownerId;
    try {
      const query = `
        SELECT
          v.venue_id,
          v.name,
          CASE 
            WHEN COUNT(b.booking_id) = 0 THEN 0
            ELSE COUNT(CASE WHEN b.status = 'Cancelled' THEN 1 END) * 100.0 / COUNT(b.booking_id)
          END AS cancellation_rate_percentage
        FROM venues v
        LEFT JOIN bookings b ON v.venue_id = b.venue_id
        WHERE v.owner_id = $1
        GROUP BY v.venue_id, v.name;
      `;
      const result = await pool.query(query, [ownerId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query error' });
    }
  });
  
  // 11. Average Event Duration per Venue (in hours)
  router.get('/averageEventDuration', async (req, res) => {
    const ownerId = req.query.ownerId;
    try {
      const query = `
        SELECT
          v.venue_id,
          v.name,
          AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time)))/3600 AS avg_event_duration_hours
        FROM venues v
        LEFT JOIN bookings b ON v.venue_id = b.venue_id
        WHERE v.owner_id = $1
          AND b.start_time IS NOT NULL 
          AND b.end_time IS NOT NULL
        GROUP BY v.venue_id, v.name;
      `;
      const result = await pool.query(query, [ownerId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query error' });
    }
  });
  
  // 12. Average Booking Lead Time per Venue (in days)
  router.get('/averageBookingLeadTime', async (req, res) => {
    const ownerId = req.query.ownerId;
    try {
      const query = `
        SELECT 
          v.venue_id,
          v.name,
          AVG(b.booking_date - DATE(b.created_at)) AS avg_lead_time_days
        FROM venues v
        JOIN bookings b ON v.venue_id = b.venue_id
        WHERE v.owner_id = $1
        GROUP BY v.venue_id, v.name;
      `;
      const result = await pool.query(query, [ownerId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query error' });
    }
  });
  
  // 13. Rating Distribution per Venue
  router.get('/ratingDistribution', async (req, res) => {
    const ownerId = req.query.ownerId;
    try {
      const query = `
        SELECT
          v.venue_id,
          v.name,
          r.rating,
          COUNT(r.review_id) AS count_per_rating
        FROM venues v
        LEFT JOIN bookings b ON v.venue_id = b.venue_id
        LEFT JOIN reviews r ON b.booking_id = r.booking_id
        WHERE v.owner_id = $1
        GROUP BY v.venue_id, v.name, r.rating
        ORDER BY v.venue_id, r.rating;
      `;
      const result = await pool.query(query, [ownerId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database query error' });
    }
  });

module.exports = router;
