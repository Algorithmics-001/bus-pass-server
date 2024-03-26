const express = require('express');
const router = express.Router();
const { getDatabasePool } = require('../db.js');

/**
 * @swagger
 * tags:
 *   name: student
 * /student/apply:
 *   get:
 *     summary: Update student information in the database
 *     description: Update student details such as roll number, course, year, batch, semester, department, and phone number.
 *     tags: [student]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of the student to update
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         required: true
 *         description: Name of the student
 *         schema:
 *           type: string
 *           example: John Doe
 *       - in: query
 *         name: rollno
 *         required: true
 *         description: Roll number of the student
 *         schema:
 *           type: string
 *           example: ABC123
 *       - in: query
 *         name: course
 *         required: true
 *         description: Course of the student
 *         schema:
 *           type: string
 *           example: Computer Science
 *       - in: query
 *         name: year
 *         required: true
 *         description: Year of study of the student
 *         schema:
 *           type: integer
 *           example: 3
 *       - in: query
 *         name: batch
 *         required: true
 *         description: Batch of the student
 *         schema:
 *           type: integer
 *           example: 2022
 *       - in: query
 *         name: semester
 *         required: true
 *         description: Semester of the student
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: department
 *         required: true
 *         description: Department of the student
 *         schema:
 *           type: string
 *           example: Information Technology
 *       - in: query
 *         name: phone_number
 *         required: true
 *         description: Phone number of the student
 *         schema:
 *           type: string
 *           example: +1234567890
 *     responses: 
 *       200:
 *         description: Student information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 test:
 *                   type: string
 *                   example: success
 *                   description: Indicates the success of the operation
 *       400:
 *         description: Bad request, one or more parameters are missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get('/student/apply', async (req, res) => {
    const {id, name, rollno, course, year, batch, semester, department, phone_number} = req.query;
    console.log(name, rollno, course, year, batch, semester, department, phone_number);
    const pool = await getDatabasePool();
    const query = `UPDATE student
    SET rollno=$1, course=$2, year=$3, batch=$4, semester=$5, department=$6, phone_number=$7 WHERE id=$8`
    const values = [rollno, course, year, batch, semester, department, phone_number, id];
    const result = await pool.query(query, values);
      // console.log(result)
      res.json({test: "success"});
  });
  
module.exports = router;
