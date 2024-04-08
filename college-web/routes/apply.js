require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');
const axios = require('axios');



/**
 * @swagger
 * /student/apply:
 *   post:
 *     summary: Apply for a bus pass as a student
 *     tags:
 *       - Student
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Student application details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from_bus_stop:
 *                 type: string
 *                 description: Starting bus stop for the journey
 *               to_bus_stop:
 *                 type: string
 *                 description: Destination bus stop for the journey
 *               renewal:
 *                 type: string
 *                 description: Indicates if it's a renewal pass or a new one
 *               bus_deport_id:
 *                 type: integer
 *                 description: ID of the bus depot
 *             required:
 *               - from_bus_stop
 *               - to_bus_stop
 *               - renewal
 *               - bus_deport_id
 *     responses:
 *       200:
 *         description: Successfully applied for the bus pass
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 form_data:
 *                   type: object
 *                   description: Details of the submitted form
 *                 student_id:
 *                   type: string
 *                   description: ID of the student who applied for the pass
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       500:
 *         description: Internal server error
 *     example:
 *       requestBody:
 *         description: Example request body
 *         content:
 *           application/json:
 *             example:
 *               from_bus_stop: "Sudhar"
 *               to_bus_stop: "Halwara"
 *               renewal: "false"
 *               bus_deport_id: 123
 */

router.post('/colege/apply', verifyToken('college'), async (req, res) => {
    const { //have to auto add prev recipt number yet.
        from_bus_stop,
        to_bus_stop,
        renewal, // Boolean. If its a renewal pass or normal.
        bus_deport_id
    } = req.body;

    const requiredFields = [
        'from_bus_stop',
        'to_bus_stop',
        'renewal',
        'bus_deport_id'
    ];
    const fields = req.checkFields(requiredFields);
    if(fields.status == false) {
        return res.status(400).send(fields.message);
    }
    const client = await req.db.connect();
    try {
        await client.query('BEGIN'); // Begin transaction
        // Queries
        await client.query('COMMIT'); // Commit transaction
        res.status(200).send("success");
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).send({error: e});
    } finally {
        client.release();
    }
});


module.exports = router;
