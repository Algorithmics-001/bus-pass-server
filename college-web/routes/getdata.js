require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');

/**
 * @swagger
 * /college/requests:
 *   get:
 *     summary: Retrieve account requests.
 *     description: Retrieve information about account requests, including student details.
 *     tags:
 *       - Account Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: account
 *         description: Filter account requests based on certain criteria.
 *         schema:
 *           type: string
 *           example: true
 *     responses:
 *       200:
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
 *                     description: The name of the user.
 *                   username:
 *                     type: string
 *                     description: The username of the user.
 *                   course:
 *                     type: string
 *                     description: The course enrolled by the student.
 *                   batch:
 *                     type: string
 *                     description: The batch of the student.
 *                   semester:
 *                     type: string
 *                     description: The semester of the student.
 *                   rollno:
 *                     type: string
 *                     description: The roll number of the student.
 *                   department:
 *                     type: string
 *                     description: The department of the student.
 *                   address:
 *                     type: string
 *                     description: The address of the student.
 *                   phone_number:
 *                     type: string
 *                     description: The phone number of the student.
 *                   usertype:
 *                     type: string
 *                     description: The user type of the user.
 *       500:
 *         description: Internal server error.
 */

router.get('/requests',verifyToken('college'), async (req, res) => {
//!important
    const {account, forwarded, renew, form} = req.query;
    if(account) {
        const accountRequestsQuery = await req.db.query(`
        SELECT u.name, u.username AS email,  s.course, s.batch, s.semester, s.rollno, s.department, s.address, s.phone_number AS phone, u.usertype AS status
        FROM 
            users AS u
            JOIN student AS s ON s.userid=u.userid
        WHERE
            u.usertype=$1 AND s.college=$2;`, [account,req.user.id]);
        return res.status(200).send(accountRequestsQuery.rows);
    } else {
        res.status(500).send("err");
    }
    // const requestsQuery = `SELECT s.name, u.username, s.course, s.batch, s.semester, s.rollno, s.department, s.address, s.phone_number, f.id, f.status, f.from_bus_stop, f.to_bus_stop, f.bus_deport_id, f.renewal, f.from_date, f.to_date, f.student_id
    // FROM form AS f
    // JOIN student AS s ON s.userid=f.student_id
    // JOIN users AS u ON u.userid=s.userid
    // WHERE s.college=$1`
    // const requestParams = [req.user.id];
    // const result = await req.db.query(requestsQuery, requestParams);

    // res.status(200).send(result.rows);
});


module.exports = router;
