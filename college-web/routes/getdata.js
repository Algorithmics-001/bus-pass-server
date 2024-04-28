require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');

/**
 * @swagger
 * /api/college/requests:
 *   post:
 *     summary: Create or retrieve account requests.
 *     description: >
 *       This endpoint allows authorized college users to create or retrieve account requests for students.
 *       - If `account` is provided in the request body, it retrieves account requests based on the specified criteria.
 *       - If `account` is not provided, it returns an error.
 *     tags:
 *       - Requests
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account:
 *                 type: string
 *               forwarded:
 *                 type: boolean
 *               renew:
 *                 type: boolean
 *               form:
 *                 type: object
 *             example:
 *               account: "student"
 *               forwarded: true
 *               renew: false
 *               form: whatever
 *     responses:
 *       '200':
 *         description: Successfully retrieved account requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   course:
 *                     type: string
 *                   batch:
 *                     type: string
 *                   semester:
 *                     type: string
 *                   rollno:
 *                     type: string
 *                   department:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   status:
 *                     type: string
 *             example:
 *               - name: "John Doe"
 *                 email: "johndoe@example.com"
 *                 course: "Computer Science"
 *                 batch: "2022"
 *                 semester: "Spring"
 *                 rollno: "CS001"
 *                 department: "Engineering"
 *                 address: "123 Street, City"
 *                 phone: "123-456-7890"
 *                 status: "student"
 *               - name: "Jane Smith"
 *                 email: "janesmith@example.com"
 *                 course: "Mathematics"
 *                 batch: "2023"
 *                 semester: "Fall"
 *                 rollno: "MATH002"
 *                 department: "Science"
 *                 address: "456 Avenue, Town"
 *                 phone: "987-654-3210"
 *                 status: "student"
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


/**
 * /college/account/:whattodo (reject/forward/restore)
 * /college/account/get/:whattodo (rejected/forwarded/applied)
 * 
 * /college/pass/:whattodo (reject/forward/restore)
 * /college/pass/get/:whattodo (rejected/forwarded/applied)
 * /service/pass/:whattodo (accept/reject)
 * /service/pass/get/:whattodo (accepted/rejected)
*/


router.post('/requests',verifyToken('college'), async (req, res) => { //deprecated
//!important
    const {account, forwarded, renew, form} = req.body;
    if(account) {
        console.log(account, req.user.id)
        const accountRequestsQuery = await req.db.query(`
        SELECT u.name, u.username AS email,  s.course, s.batch, s.semester, s.rollno, s.department, s.address, s.phone_number AS phone, u.usertype AS status, s.userid AS acc_id
        FROM 
            users AS u
            JOIN student AS s ON s.userid=u.userid
        WHERE
            u.usertype=$1 AND s.college=$2;`, [account,req.user.id]);
        return res.status(200).send(accountRequestsQuery.rows);
    }

    if(form) {
        const _forwarded = (forwarded)?true:false;
        const _renew = (renew)?true:false;
    const formRequestQuery = `SELECT s.name, u.username, s.course, s.batch,
    s.semester, s.rollno, s.department, s.address, s.phone_number, f.id AS form_id,
    f.status, f.from_bus_stop, f.to_bus_stop, f.bus_deport_id, f.renewal, 
    f.from_date, f.to_date, f.student_id AS acc_id
        FROM form AS f
        JOIN student AS s ON s.userid=f.student_id
        JOIN users AS u ON u.userid=s.userid
        WHERE s.college=$1 AND f.renew=$2 AND f.forwarded=$3`;
    const formRequest = await req.db.query(formRequestQuery, [req.user.id, _renew, _forwarded]);
    return res.status(200).send(formRequest.rows);
    } else {
        return res.status(401).send({error: "missing fields."});
    }
});


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
    WHERE f.status='accepted' AND s.college=$1;
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
    
    res.status(200).send({
        // college_id: req.user.id,
        account_requests: accountRequests.rows[0].count,
        account_requests_accepted: accountsAccepted.rows[0].count,
        account_requests_rejected: accountsRejected.rows[0].count,
        passes_accepted: passesAccepted.rows[0].count,
        passes_rejected: passesRejected.rows[0].count,
        passes_forwarded: passesForwarded.rows[0].count,
        passes_denied: passesDenied.rows[0].count,
        renew_accepted: renewAccepted.rows[0].count,
    });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Internal Server Error.")
    }

});

module.exports = router;
