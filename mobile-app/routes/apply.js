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

router.post('/student/apply', verifyToken('student'), async (req, res) => {
    const { //have to auto add prev recipt number yet.
        from_bus_stop,
        to_bus_stop,
        renewal, // Boolean. If its a renewal pass or normal.
        bus_deport_id,
        from_date,
        to_date
    } = req.body;

    const requiredFields = [
        'from_bus_stop',
        'to_bus_stop',
        'renewal',
        'bus_deport_id',
        'from_date',
        'to_date'
    ];
    const fields = req.checkFields(requiredFields);
    if(fields.status == false) {
        return res.status(400).send(fields.message);
    }
    const client = await req.db.connect();
    try {
        await client.query('BEGIN'); // Begin transaction
        // Queries
        const formQuery = `INSERT INTO form(
            status,
            from_bus_stop,
            to_bus_stop,
            renewal,
            bus_deport_id,
            from_date,
            to_date
            ) VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`;
        const formParameters = [
            "applied",
            from_bus_stop,
            to_bus_stop,
            renewal, // Boolean. If its a renewal pass or normal.
            bus_deport_id,
            from_date,
            to_date
        ];
        const form_query = await client.query(formQuery, formParameters);
        const pass_id = form_query.rows[0].id;
        const insertFormIdQuery = `UPDATE student SET form_id=$1 WHERE userid=$2`;
        const insertFormIdParameters = [pass_id, req.user.id];
        const result = await client.query(insertFormIdQuery, insertFormIdParameters);

        await client.query('COMMIT'); // Commit transaction
        res.status(200).send({id: form_query.rows[0].id});
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).send({error: e});
    } finally {
        client.release();
    }
});


module.exports = router;
