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
 * /login:
 *   post:
 *     summary: simple login endpoint
 *     tags: [LogIn]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginData'
 *     responses:
 *       200:
 *         description: Loggged in Successfully!
 *         content:
 *           application/json:
 *             example:
 *              message: Loggged in Successfully!
 *              id: 132456
 *       500:
 *         description: Some server error
 *
 */
router.post('/login', async (req, res) => {
    const loginData = req.body;
    console.log(loginData);
    const pool = await getDatabasePool();
    var username;
    let id;
    try {
      pool.query(`SELECT * FROM users WHERE username='${loginData.email}' AND password='${loginData.password}'`, (err, r) => {
        console.log(r.rowCount);
        if (r.rowCount != 0) {
          username = r.rows[0].name;
          id = r.rows[0].userid;
          return res.send({
            message: `Logged in successfully! username: ${username}`,
            type: "success",
            name: `${username}`,
            id: `${id}`
          })
        } else {
          return res.send({
            message: "Username or Password invalid.",
            type: "error"
          })
        }
      });
    }
    catch (e) {
      return res.send({
        message: "Username or Password invalid.",
        type: "error"
      })
    }
  });
  



  
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginData:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of the user.
 *         password:
 *           type: string
 *           description: Password for the user's account.
 *       example:
 *         email: test@example.com
 *         password: Str0Ngp@ssWO4D
*/
module.exports = router;
