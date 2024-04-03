require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');


/**
 * @swagger
 * /get/student:
 *   post:
 *     summary: Retrieve student information
 *     description: Retrieves information about the logged-in student.
 *     tags:
 *       - Student
 *     security:
 *       - bearerAuth: []
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     course:
 *                       type: string
 *                     year:
 *                       type: integer
 *                     batch:
 *                       type: string
 *                     semester:
 *                       type: integer
 *                     department:
 *                       type: string
 *                     aadhar_number:
 *                       type: string
 *                     college:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     rollno:
 *                       type: string
 *                     userid:
 *                       type: string
 *                     father_name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     admission_date:
 *                       type: string
 *                       format: date
 *                     email:
 *                       type: string
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '500':
 *         description: Internal Server Error
 */


router.post('/get/student',verifyToken('student'), async (req, res) => {
    const id = req.user.id;
    console.log(id);
    const pool = req.db;
      try {
      const getStudentQuery = `SELECT
        name,
        course,
        year,
        batch,
        semester,
        department,
        aadhar_number,
        college,
        phone_number,
        rollno,
        userid,
        father_name,
        address,
        admission_date,
        email
      FROM student WHERE userid=$1;
    `;
    const getStudentParameters = [id];
    result = await pool.query(getStudentQuery, getStudentParameters);
    rows = result.rows[0];
    res.status(200).send({
        rows
      });

      } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Internal Server Error');
      }
});


module.exports = router;
