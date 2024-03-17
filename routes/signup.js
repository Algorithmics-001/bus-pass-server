const express = require('express');
const router = express.Router();
const { getDatabasePool } = require('../db.js');


function checkMissingFields(query) {
    const requiredFields = ['name', 'email', 'password', 'course', 'batch', 'semester', 'rollno', 'department', 'phone'];
    const missingFields = [];
    requiredFields.forEach(field => {
      if (!query[field]) {
        missingFields.push(field);
      }
    });
  
    if (missingFields.length > 0) {
      return {
        status: false,
        message: `Missing fields: ${missingFields.join(', ')}`
      };
    } else {
      return {
        status: true
      };
    }
  }
/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Simple account creation, deletion, login etc.
 * /signup:
 *   post:
 *     summary: simple signup endpoint
 *     tags: [SignUp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupData'
 *     responses:
 *       200:
 *         description: Congratulations, Account Created Successfully!
 *         content:
 *           application/json:
 *             example:
 *              message: Congratulations, Account Created Successfully!
 *              id: 132456
 *       500:
 *         description: Some server error
 *
 */
router.post('/signup', async (req, res) => {
    const { name, email, password, course, batch, semester, rollno, department, phone } = req.body;
    fields = checkMissingFields(req.body);
    if(fields.status==true) {
    const pool = await getDatabasePool();
    try {
      const userExistQuery = 'SELECT * FROM users WHERE username = $1';
      const userExistValues = [email];
      const existingUser = await pool.query(userExistQuery, userExistValues);
  
      if (existingUser.rowCount > 0) {
        return res.send({
          message: "User already exists.",
          type: "error"
        });
      }
  
    // Insert into users table and retrieve the inserted user's ID
    const insertUserQuery = 'INSERT INTO users(username, password, name, usertype) VALUES($1, $2, $3, $4) RETURNING userid';
    const insertUserValues = [email, password, name, 'student'];
    const { rows } = await pool.query(insertUserQuery, insertUserValues);
    const userid = rows[0].userid;
    console.log(userid)
    const insertStudentQuery = 'INSERT INTO student(name, course, batch, semester, rollno, department, phone_number, userid) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const insertStudentValues = [name, course, batch, semester, rollno, department, phone, userid];
    await pool.query(insertStudentQuery, insertStudentValues);
      res.status(200).send({
        message: 'Congratulations, Account Created Successfully!',
        id: userid
    });
  
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send('Internal Server Error');
    }
  
    } else {
      res.status(500).send({
        message: fields.message
      });
    }
  });



  
/**
 * @swagger
 * components:
 *   schemas:
 *     SignupData:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - course
 *         - batch
 *         - semester
 *         - rollno
 *         - department
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: Name of the student.
 *         email:
 *           type: string
 *           description: Email address of the student.
 *         password:
 *           type: string
 *           description: Password for the student's account.
 *         course:
 *           type: string
 *           description: Course in which the student is enrolled.
 *         batch:
 *           type: integer
 *           description: Year of batch for the student.
 *         semester:
 *           type: integer
 *           description: Current semester of the student.
 *         rollno:
 *           type: integer
 *           description: Roll number of the student.
 *         department:
 *           type: string
 *           description: Department in which the student is studying.
 *         phone:
 *           type: string
 *           description: Phone number of the student.
 *
 *       example:
 *         name: Amrinder Singh
 *         email: test@example.com
 *         password: Str0Ngp@ssWO4D
 *         course: inter
 *         batch: 2025
 *         semester: 3
 *         rollno: 123456
 *         department: CSE
 *         phone: 123456789
*/
module.exports = router;
