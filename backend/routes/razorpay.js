const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../db'); 
require('dotenv').config();

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Test Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Test Key Secret
});

// Endpoint to create an order
router.post('/create-booking', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: currency,
      receipt: `order_${Date.now()}`,
    });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Endpoint to verify payment
router.post('/verify-payment', async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingDetails, // Contains booking details like booking_id, user_id, and amount
        paymentMethod,
    } = req.body;
    console.log("Booking Details: "+bookingDetails)
    console.log(paymentMethod)

    try {
        // Verify Razorpay signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Insert payment details into the payments table
        const query = `
            INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [
            bookingDetails.bookingId,
            bookingDetails.userId,
            bookingDetails.price,
            paymentMethod || 'Razorpay', // Default to "Razorpay" if no payment method is provided
            'Success',
        ];
        console.log(values)

        const result = await pool.query(query, values);

        // Send success response
        res.status(200).json({
            message: 'Payment verified and stored successfully',
            paymentDetails: result.rows[0],
        });
    } catch (error) {
        console.error('Error storing payment details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
  
module.exports = router;
