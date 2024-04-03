require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');
const axios = require('axios');


async function sendToDiscord(message) {
  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message
  })
  .then(response => {
      console.log('Message sent:', response.data);
  })
  .catch(error => {
      console.error('Error sending message:', error);
  });
}

/**
 * @swagger
 * /student/update:
 *   post:
 *     summary: Update student information
 *     description: Update student details in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student.
 *                 example: John Doe
 *               course:
 *                 type: string
 *                 description: The course enrolled by the student.
 *                 example: Computer Science
 *               year:
 *                 type: integer
 *                 description: The current academic year of the student.
 *                 example: 2
 *               batch:
 *                 type: integer
 *                 description: The batch the student belongs to.
 *                 example: 2023
 *               semester:
 *                 type: integer
 *                 description: The current semester of the student.
 *                 example: 4
 *               department:
 *                 type: string
 *                 description: The department of the student.
 *                 example: Engineering
 *               aadhar_number:
 *                 type: string
 *                 description: The Aadhar number of the student.
 *                 example: 1234 5678 9012
 *               bus_pass:
 *                 type: boolean
 *                 description: Indicates if the student has a bus pass.
 *                 example: true
 *               college:
 *                 type: string
 *                 description: The college the student is enrolled in.
 *                 example: ABC College
 *               form:
 *                 type: string
 *                 description: The form submitted by the student.
 *                 example: Admission Form 2024
 *               phone_number:
 *                 type: string
 *                 description: The phone number of the student.
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 description: The password for student authentication.
 *                 example: strongpassword
 *               email:
 *                 type: string
 *                 description: The email address of the student.
 *                 example: john.doe@example.com
 *               rollno:
 *                 type: string
 *                 description: The roll number of the student.
 *                 example: ABC12345
 *               userid:
 *                 type: string
 *                 description: The user ID of the student.
 *                 example: johndoe123
 *               father_name:
 *                 type: string
 *                 description: The name of the student's father.
 *                 example: Michael Doe
 *               address:
 *                 type: string
 *                 description: The address of the student.
 *                 example: 123 Main Street, City, Country
 *               admission_date:
 *                 type: string
 *                 format: date
 *                 description: The admission date of the student.
 *                 example: 2024-03-31
 *     responses:
 *       200:
 *         description: Success message indicating the student information was updated successfully.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: success
 */



router.post('/student/update', async (req, res) => {
    const {
        name,
        course,
        year,
        batch,
        semester,
        department,
        aadhar_number,
        bus_pass,
        college,
        form,
        phone_number,
        password,
        email,
        rollno,
        userid,
        father_name,
        address,
        admission_date
    } = req.body;

    const query = `UPDATE student SET
        name=$1,
        course=$2,
        year=$3,
        batch=$4,
        semester=$5,
        department=$6,
        aadhar_number=$7,
        college=$8,
        phone_number=$9,
        rollno=$10,
        father_name=$12,
        address=$13,
        admission_date=$14

        WHERE userid=$11
    `;
    const parameters = [
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
        admission_date
    ];

    const result = req.db.query(query, parameters);
    res.status(200).send("success")
});
  
module.exports = router;
