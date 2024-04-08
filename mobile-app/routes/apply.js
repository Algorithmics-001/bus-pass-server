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
 *               bus_deport_id:
 *                 type: integer
 *                 description: ID of the bus depot
 *               from_date:
 *                 type: string
 *                 format: date
 *                 description: Starting date of the pass validity
 *               to_date:
 *                 type: string
 *                 format: date
 *                 description: Ending date of the pass validity
 *             required:
 *               - from_bus_stop
 *               - to_bus_stop
 *               - bus_deport_id
 *               - from_date
 *               - to_date
 *     responses:
 *       200:
 *         description: Successfully applied for the bus pass
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the newly created bus pass form
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       500:
 *         description: Internal server error
 */


router.post('/student/apply', verifyToken('student'), async (req, res) => {
    const { //have to auto add prev recipt number yet.
        from_bus_stop,
        to_bus_stop,
        bus_deport_id,
        from_date,
        to_date
    } = req.body;

    const requiredFields = [
        'from_bus_stop',
        'to_bus_stop',
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
        const renewalQuery = 'SELECT bus_pass_id FROM student WHERE userid=$1'
        const renewalParams = [req.user.id];
        const renewal = await client.query(renewalQuery, renewalParams);
        if(renewal.rowCount = 0) {
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
                "false", // Boolean. If its a renewal pass or normal.
                bus_deport_id,
                from_date,
                to_date
            ];
            var form_query = await client.query(formQuery, formParameters);
        } else {
            const formQuery = `INSERT INTO form(
                status,
                from_bus_stop,
                to_bus_stop,
                renewal,
                bus_deport_id,
                from_date,
                to_date,
                previous_recipt_number
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id`;
            const formParameters = [
                "applied",
                from_bus_stop,
                to_bus_stop,
                "true", // Boolean. If its a renewal pass or normal.
                bus_deport_id,
                from_date,
                to_date,
                renewal.rows[0].bus_pass_id
            ];
            var form_query = await client.query(formQuery, formParameters);
        }
        // Queries
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
