const express = require('express');
const router = express.Router();
const db = require('../db'); // Your PostgreSQL connection
const authenticateToken = require('../middleware/authToken'); // To verify user token

// Create a new support ticket
router.post('/ticket', async (req, res) => {
    try {
        const { booking_id, subject, description, priority, category_id, user_id } = req.body;
        // Get category details to set default priority and estimated resolution
        let categoryDetails = null;
        if (category_id) {
            const categoryResult = await db.query(
                'SELECT * FROM ticket_categories WHERE id = $1',
                [category_id]
            );
            categoryDetails = categoryResult.rows[0];
        }
        
        const finalPriority = priority || (categoryDetails ? categoryDetails.default_priority : 'medium');
        
        // Calculate estimated resolution date
        let estimatedResolution = null;
        if (categoryDetails && categoryDetails.estimated_resolution_days) {
            const resolutionDate = new Date();
            resolutionDate.setDate(resolutionDate.getDate() + categoryDetails.estimated_resolution_days);
            estimatedResolution = resolutionDate;
        }
        
        const result = await db.query(
            `INSERT INTO grievances 
            (user_id, booking_id, subject, description, priority, category_id, estimated_resolution) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [user_id, booking_id, subject, description, finalPriority, category_id, estimatedResolution]
        );
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create support ticket' });
    }
});

// Get all tickets for a user
router.get('/alltickets/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        // const isAdmin = req.user.role === 'venueowners';
        
        let query = 'SELECT * FROM grievances WHERE user_id = $1 ORDER BY created_at DESC';
        let params = [user_id];
        
        // if (isAdmin) {
        //     query = 'SELECT * FROM grievances ORDER BY created_at DESC';
        //     params = [];
        // }
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// Get single ticket details (User-specific)
router.get('/tickets/:ticket_id/:user_id', async (req, res) => {
    try {
        const { ticket_id, user_id } = req.params;

        // Get ticket with user verification
        const ticketResult = await db.query(
            `SELECT g.* 
             FROM grievances g
             WHERE g.id = $1 AND g.user_id = $2`,
            [ticket_id, user_id]
        );
        
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Ticket not found or unauthorized access' 
            });
        }
        
        const ticket = ticketResult.rows[0];
        
        // Get responses
        const responsesResult = await db.query(
            `SELECT tr.*, u.*
             FROM ticket_responses tr
             JOIN users u ON tr.user_id = u.id
             WHERE tr.ticket_id = $1
             ORDER BY tr.created_at ASC`,
            [ticket_id]
        );
        

        // console.log(responsesResult.rows);

        
        res.json({
            ticket,
            responses: responsesResult.rows
            // attachments: attachmentsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Failed to fetch ticket details',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Add response to a ticket (User-only)
router.post('/tickets/:ticket_id/:user_id/responses', async (req, res) => {
    try {
        const { ticket_id, user_id } = req.params;
        const { message } = req.body;

        // Verify ticket exists and belongs to the user
        const ticketResult = await db.query(
            `SELECT * FROM grievances 
             WHERE id = $1 AND user_id = $2`,
            [ticket_id, user_id]
        );
        
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Ticket not found or unauthorized access' 
            });
        }

        // Add user response (is_admin always false for user responses)
        const responseResult = await db.query(
            `INSERT INTO ticket_responses 
             (ticket_id, user_id, message, is_admin) 
             VALUES ($1, $2, $3, false) 
             RETURNING *`,
            [ticket_id, user_id, message]
        );

        // Update ticket status to 'open' when user responds
        await db.query(
            `UPDATE grievances 
             SET status = 'open', updated_at = NOW() 
             WHERE id = $1`,
            [ticket_id]
        );

        // Get the full response with user details
        const fullResponse = await db.query(
            `SELECT tr.*, u.*
             FROM ticket_responses tr
             JOIN users u ON tr.user_id = u.id
             WHERE tr.id = $1`,
            [responseResult.rows[0].id]
        );

        // console.log(fullResponse.rows[0]);

        res.status(201).json({
            success: true,
            response: fullResponse.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to add response',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});
// Update ticket status (venueowners only)
router.patch('/tickets/:id/status', authenticateToken, async (req, res) => {
    try {
        const ticket_id = req.params.id;
        const { status } = req.body;
        
        if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const result = await db.query(
            'UPDATE grievances SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, ticket_id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update ticket status' });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM ticket_categories ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Submit feedback for a ticket
router.post('/tickets/:id/feedback', authenticateToken, async (req, res) => {
    try {
        const ticket_id = req.params.id;
        const { rating, comments } = req.body;
        const user_id = req.user.id;
        
        // Verify ticket exists and belongs to user
        const ticketResult = await db.query(
            'SELECT * FROM support_tickets WHERE id = $1 AND user_id = $2 AND status = $3',
            [ticket_id, user_id, 'resolved']
        );
        
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found or not eligible for feedback' });
        }
        
        // Check if feedback already exists
        const existingFeedback = await db.query(
            'SELECT * FROM ticket_feedback WHERE ticket_id = $1',
            [ticket_id]
        );
        
        if (existingFeedback.rows.length > 0) {
            return res.status(400).json({ error: 'Feedback already submitted for this ticket' });
        }
        
        // Insert feedback
        const result = await db.query(
            'INSERT INTO ticket_feedback (ticket_id, rating, comments) VALUES ($1, $2, $3) RETURNING *',
            [ticket_id, rating, comments]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Mark ticket as resolved (user confirmation)
router.post('/tickets/:id/resolve', authenticateToken, async (req, res) => {
    try {
        const ticket_id = req.params.id;
        const user_id = req.user.id;
        const { is_resolved } = req.body;
        
        // Verify ticket exists and belongs to user
        const ticketResult = await db.query(
            'SELECT * FROM support_tickets WHERE id = $1 AND user_id = $2',
            [ticket_id, user_id]
        );
        
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        const ticket = ticketResult.rows[0];
        
        if (is_resolved) {
            // Mark as resolved
            await db.query(
                'UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2',
                ['resolved', ticket_id]
            );
            res.json({ message: 'Ticket marked as resolved' });
        } else {
            // Reopen ticket
            await db.query(
                'UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2',
                ['open', ticket_id]
            );
            res.json({ message: 'Ticket reopened for further assistance' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update ticket status' });
    }
});



//venue owners 

// Get all tickets for venue owners (venueowners)
router.get('/venueowners/tickets', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT  u.*, g.*
            FROM grievances g
            JOIN users u ON g.user_id = u.id
            ORDER BY g.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// Get single ticket details for venue owner
router.get('/venueowners/tickets/:ticketId', async (req, res) => {
    const {ticketId} = req.params

    try {
        // console.log(ticketId)
        const result = await db.query(`
            SELECT g.*, u.* FROM grievances g
            JOIN users u ON g.user_id = u.id
            where g.id = $1
        `, [ticketId]);

        
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        const responses = await db.query(`
             SELECT tr.*, u.*
            FROM ticket_responses tr
            JOIN users u ON tr.user_id = u.id
            WHERE tr.ticket_id = $1
            ORDER BY tr.created_at ASC
        `, [ticketId]);

        // console.log(responses.rows)
        // console.log(result.rows[0])
        
        res.json({
            ticket: result.rows[0],
            responses: responses.rows
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch ticket details' });
    }
});

// Add response as venue owner
router.post('/venueowners/tickets/:ticket_id/responses', async (req, res) => {
    try {
        const { message, user_id } = req.body;
        const ticket_id = req.params.ticket_id
        // console.log(req.body, ticket_id)
        const result = await db.query(`
            INSERT INTO ticket_responses 
            (ticket_id, user_id, message, is_admin)
            VALUES ($1, $2, $3, true)
            RETURNING *
        `, [ticket_id, user_id, message]);

        // console.log("sds", result.rows[0])
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add response' });
    }
});

// Update ticket status
router.patch('/venueowners/tickets/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await db.query(`
            UPDATE grievances 
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `, [status, req.params.id]);
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;