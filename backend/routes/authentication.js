const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Sign Up
router.post('/signup', async (req, res) => {
    const { first_name, last_name, phone, email, password, cpassword } = req.body;
    console.log(req.body);
    if (password !== cpassword) {
        return res.status(400).json({ error: 'Passwords do not match!' });
      }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (first_name, last_name, phone, email, password) VALUES ($1, $2, $3, $4, $5)',
            [first_name, last_name, phone, email, hashedPassword]
        );
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(404).send('User not found');

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).send('Invalid credentials');

        const token = jwt.sign({ userId: user.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

module.exports = router;
