const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
require('dotenv').config();
const otpGenerator = require("otp-generator");
const emails = require("./email_service");
const sendOTPEmail = emails.sendOTPEmail;
const sendPasswordResetEmail = emails.sendPasswordResetEmail;

router.post("/signup", async (req, res) => {
    const { first_name, last_name, phone, email, password, cpassword } = req.body;

    if (password !== cpassword) {
        return res.status(400).json({ error: "Passwords do not match!" });
    }

    try {
        // Check if user exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user data temporarily without marking as verified
        await pool.query(
            "INSERT INTO users (first_name, last_name, phone, email, password) VALUES ($1, $2, $3, $4, $5)",
            [first_name, last_name, phone, email, hashedPassword]
        );


        console.log("New User Signup Request -->", req.body);
        res.status(201).send('User registered successfully');

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).send("Error registering user");
    }
});


router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    console.log(email)

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    // Generate OTP
    const otp = otpGenerator.generate(6, { 
        digits: true, 
        upperCaseAlphabets: false, 
        lowerCaseAlphabets: false, 
        specialChars: false 
    });

    try {
         await pool.query(
            "INSERT INTO otp_verifications (email, otp, otp_expires_at) VALUES ($1, $2, NOW() + INTERVAL '5 minutes')",
            [email, otp]
        );
    
        console.log("OTP stored successfully:");
        await sendOTPEmail(email, otp);
        res.status(200).json({ message: "OTP sent to email. Verify OTP to complete registration." });
    
    } catch (error) {
        console.error("Error inserting OTP:", error);
        res.status(500).json({ success: false, message: "Failed to store OTP in the database" });
    }
    
});

// In your authentication routes
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await pool.query(
            'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
            [email]
        );
        res.json({ exists: result.rows[0].exists });
    } catch (error) {
        res.status(500).json({ message: 'Error checking email' });
    }
});

// verifying otp
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Check OTP record
        const otpRecord = await pool.query(
            "SELECT * FROM otp_verifications WHERE email = $1 ORDER BY otp_expires_at DESC LIMIT 1",
            [email]
        );

        if (otpRecord.rows.length === 0) {
            return res.status(400).json({ error: "No OTP found for this email!" });
        }

        const storedOTP = otpRecord.rows[0].otp;
        const otpExpiresAt = otpRecord.rows[0].otp_expires_at;

        if (storedOTP !== otp || new Date() > new Date(otpExpiresAt)) {
            return res.status(400).json({ error: "Invalid or expired OTP!" });
        }


        // Delete OTP record after successful verification
        await pool.query("DELETE FROM otp_verifications WHERE email = $1", [email]);
        console.log("deleted")
        res.status(200).json({ message: "OTP verified successfully. Registration complete!" });
    } catch (err) {
        console.error("OTP Verification Error:", err);
        res.status(500).send("Server error");
    }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log("\nUser logging in -->", req.body);

        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).send('Invalid credentials');
        }

        // Extract the user ID and email
        const userdetails = user.rows[0];
        const userId = user.rows[0].id;
        const userEmail = user.rows[0].email;

        // Generate JWT with the user ID
        const token = jwt.sign({ id: userId, email: userEmail }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token validity
        });

        console.log('Generated Token:', token);

        res.json({ message: 'Login successful', userdetails, token });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Error logging in');
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        // 1. Validate email input
        if (!email || !email.includes('@')) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // 2. Check if user exists
        const userQuery = await pool.query(
            'SELECT id, email FROM users WHERE email = $1',
            [email]
        );
        
        if (userQuery.rows.length === 0) {
            // Return generic success message to prevent email enumeration
            return res.status(404).json({ 
                success: false,
                message: 'No account with that email exists'
            });
        }

        const user = userQuery.rows[0];
        
        // 3. Create reset token (expires in 1 hour)
        const resetToken = jwt.sign(
            { 
                id: user.id,
                purpose: 'password_reset' // Specific purpose to prevent token reuse
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // // 4. Store token hash in database (not plain token)
        // const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        // const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
        
        // await pool.query(
        //     `UPDATE users 
        //      SET reset_password_token = $1, 
        //          reset_password_expires = $2 
        //      WHERE id = $3`,
        //     [tokenHash, expiresAt, user.id]
        // );
        
        // 5. Send email using our email service
        await sendPasswordResetEmail(user.email, resetToken);
        
        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, a reset link has been sent'
        });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        
        // Don't expose specific error details in production
        const errorMessage = process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Error processing your request';
            
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    
    try {
        // 1. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Check if token exists in DB and hasn't expired
        const userQuery = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [decoded.id]
        );
        
        if (userQuery.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        
        const user = userQuery.rows[0];
        
        // 3. Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 4. Update password and clear reset token
        await pool.query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, user.id]
        );
        
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
        
    } catch (error) {
        console.error('Reset password error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'Token has expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
});



module.exports = router;
