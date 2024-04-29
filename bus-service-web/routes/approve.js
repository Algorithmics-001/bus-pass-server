require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');
const axios = require('axios');

/**
 * @swagger
 * /api/bus-service/requests/individual:
 *   post:
 *     summary: Update individual account requests.
 *     description: >
 *       This endpoint allows authorized college users to update individual account requests by providing the account ID (`acc_id`) and either an `account` type or `form` details.
 *     tags:
 *       - Individual Requests
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               acc_id:
 *                 type: string
 *               account:
 *                 type: string
 *               form:
 *                 type: string
 *               forwarded:
 *                 type: boolean
 *             example:
 *               acc_id: "123456789"
 *               account: "student"
 *               form: "idfk"
 *               forwarded: true
 *     responses:
 *       '200':
 *         description: Successfully updated individual account request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *             example:
 *               status: "Query Success. Affected rows: 1"
 *       '400':
 *         description: Bad request. Missing `acc_id` or both `account` and `form` parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid request. Missing 'acc_id' or both 'account' and 'form' parameters."
 *       '401':
 *         description: Unauthorized. `acc_id` not provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Account id not provided"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Internal Server Error"
 */


router.post('/requests/individual', verifyToken('bus-service'), async (req, res) => {
    const { acc_id, form } = req.body;
    if(!acc_id) {
        return res.status(401).send({error: "Account id not provided"});
    }
    if(form) {
        try {

            const client = await req.db.connect();
            await client.query('BEGIN'); // Begin transaction
            const formQuery = await req.db.query(`UPDATE form SET status=$1 WHERE id=(SELECT student_id FROM users WHERE userid=$2)`, [form, acc_id]);
            if(form === "accepted") {
                const passQuery = await req.db.query(`INSERT INTO bus_pass (from_date, to_date, from_bus_stop, to_bus_stop, payment_ticket, userid)
                SELECT f.from_date, f.to_date, f.from_bus_stop, f.to_bus_stop, f.payment_ticket, s.userid
                FROM form AS f
                JOIN student AS s ON s.id = f.student_id
                WHERE s.userid = $1
                RETURNING id;            
                `, [acc_id]);
                const updateStudentQuery = await req.db.query("UPDATE student SET bus_pass_id=$1 WHERE userid=$2",
                [passQuery.rows[0].id, acc_id]);
                await client.query('COMMIT'); // Commit transaction
            }
            return res.status(200).send({status: `Query Success. Affected rows: ${formQuery.rowCount}`})
        } catch (e) {
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    }

    res.status(200).json(":idfk");
});


module.exports = router;
