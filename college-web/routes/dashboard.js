require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve statistics for the college dashboard including account requests, account requests accepted, account requests rejected, passes accepted, passes rejected, passes forwarded, passes denied, and renewals accepted.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                   number:
 *                     type: integer
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */

router.get('/dashboard', verifyToken('college'), async (req, res) => {
    try {
    const accountRequests = await req.db.query(`SELECT COUNT(*) FROM
    users AS u
    JOIN student AS s ON s.userid=u.userid
    WHERE
    u.usertype='applied' AND s.college=$1`, [req.user.id]);

    const accountsAccepted = await req.db.query(`SELECT COUNT(*) FROM
    users AS u
    JOIN student AS s ON s.userid=u.userid
    WHERE
    u.usertype='student' AND s.college=$1`, [req.user.id]);

    const accountsRejected = await req.db.query(`SELECT COUNT(*) FROM
    users AS u
    JOIN student AS s ON s.userid=u.userid
    WHERE
    u.usertype='rejected' AND s.college=$1`, [req.user.id]);

    const passesAccepted = await req.db.query(`SELECT COUNT(*) FROM 
    form AS f JOIN student AS s ON s.id=f.student_id
    WHERE f.status='accepted' AND s.college=$1;
    `, [req.user.id]);

    const passesRejected = await req.db.query(`SELECT COUNT(*) FROM 
    form AS f JOIN student AS s ON s.id=f.student_id
    WHERE f.status='rejected' AND s.college=$1;
    `, [req.user.id]);

    const passesForwarded = await req.db.query(`SELECT COUNT(*) FROM 
    form AS f JOIN student AS s ON s.id=f.student_id
    WHERE f.status='forwarded' AND s.college=$1;
    `, [req.user.id]);

    const passesDenied = await req.db.query(`SELECT COUNT(*) FROM 
    form AS f JOIN student AS s ON s.id=f.student_id
    WHERE f.status='denied' AND s.college=$1;
    `, [req.user.id]);

    const renewAccepted = await req.db.query(`SELECT COUNT(*) FROM 
    form AS f JOIN student AS s ON s.id=f.student_id
    WHERE f.status='accepted' AND f.renewal=true AND s.college=$1;
    `, [req.user.id]);
    
    res.status(200).send([
        // college_id: req.user.id,
        {text:"Account Requests", number: accountRequests.rows[0].count},
        {text:"Account Requests Accepted", number: accountsAccepted.rows[0].count},
        {text:"Account Requests Rejected", number: accountsRejected.rows[0].count},
        {text:"Passes Accepted", number: passesAccepted.rows[0].count},
        {text:"Passes Rejected", number: passesRejected.rows[0].count},
        {text:"Passes Forwarded", number: passesForwarded.rows[0].count},
        {text:"Passes Denied", number: passesDenied.rows[0].count},
        {text:"Renew Accepted", number: renewAccepted.rows[0].count},
    ]);

    } catch (e) {
        console.log(e);
        return res.status(500).send("Internal Server Error.")
    }

});

module.exports = router;
