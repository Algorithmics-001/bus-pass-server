require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');
const axios = require('axios');




/**
 * @swagger
 * /api/college/requests/individual:
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


router.post('/requests/individual', verifyToken('college'), async (req, res) => {
    const { acc_id, account, form, forwarded } = req.body;
    if(!acc_id) {
        return res.status(401).send({error: "Account id not provided"});
    }

    if(account) {
        const accountQuery = await req.db.query(`UPDATE users SET usertype=$1 WHERE userid=$2`, [account, acc_id]);
        return res.status(200).send({status: `Query Success. Affected rows: ${accountQuery.rowCount}`})
    }

    if(form) {
        const _forwarded = (forwarded)?true:false;
        const formQuery = await req.db.query(`UPDATE form SET status=$1, forwarded=$2 WHERE id=(SELECT * FROM user WHERE userid=$3)`, [form,_forwarded, acc_id]);
        return res.status(200).send({status: `Query Success. Affected rows: ${formQuery.rowCount}`})
    }

    res.status(200).json(":idfk");
});


module.exports = router;
