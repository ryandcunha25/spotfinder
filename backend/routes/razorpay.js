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
    console.log(order)
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
    } = req.body;
    console.log("Booking Details: "+bookingDetails)
    
    try {
      // Verify Razorpay signature
      const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Payment verification failed' });
          }
          
          const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
          const paymentMethod = paymentDetails.method; 

        // Insert payment details into the payments table
        const query = `
            INSERT INTO payments (payment_id, booking_id, user_id, amount, payment_method, payment_status)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const values = [
            razorpay_payment_id,
            bookingDetails.booking_id,
            bookingDetails.user_id,
            bookingDetails.price,
            paymentMethod, 
            'Success',
        ];
        console.log(values)

        const result = await pool.query(query, values);
        

        // Send success response
        res.status(200).json({
          message: 'Payment verified and saved successfully',
          paymentDetails: {
              payment_status: 'Success',
              payment_method: paymentMethod,
          },
      });
    } catch (error) {
        console.error('Error storing payment details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Refund Payment API
router.post("/refund/:payment_id", async (req, res) => {
  const { payment_id } = req.params;
  console.log(payment_id)

  try {
  
      // Request refund from Razorpay
      const refund = razorpay.payments.refund(payment_id);
      console.log(refund)
      

      res.status(200).json({ message: "Refund processed successfully", refund });
  } catch (error) {
      console.error("Refund Error:", error);
      res.status(500).json({ error: "Failed to process refund" });
  }
});
  

router.get("/show-payment-details/:booking_id", async (req, res) => {
  const { booking_id } = req.params;
  
  try {
      const paymentQuery = await pool.query(
          "SELECT * FROM payments WHERE booking_id = $1", 
          [booking_id]
      );

      if (paymentQuery.rows.length === 0) {
          return res.status(404).json({ message: "No payment details found" });
      }

      res.json(paymentQuery.rows[0]);
  } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;