require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');

/**
 * @swagger
 * /api/bus-service/requests:
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


router.post('/requests',verifyToken('bus-service'), async (req, res) => {
//!important
    const {account, forwarded, renew, form} = req.body;
    if(account) {
        console.log(account, req.user.id)
        const accountRequestsQuery = await req.db.query(`
        SELECT u.name, u.username AS email,  s.course, s.batch, s.semester, s.rollno, s.department, s.address, s.phone_number AS phone, u.usertype AS status
        FROM 
            users AS u
            JOIN student AS s ON s.userid=u.userid
        WHERE
            u.usertype='student';`);
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
        WHERE f.renew=$1 AND f.forwarded=$2`;
    const formRequest = await req.db.query(formRequestQuery, [_renew, _forwarded]);
    return res.status(200).send(formRequest.rows);
    } else {
        return res.status(401).send({error: "missing fields."});
    }
});


router.post('/complaint', async (req, res) => {
    const {complaint_type, complaint_description} = req.body;
    await req.db.query('INSERT INTO complaint(complaint_type, complaint_description) VALUES($1, $2)',
    [complaint_type, complaint_description]
    );
    res.status(200).send("complaint recieved");
});
  


module.exports = router;
