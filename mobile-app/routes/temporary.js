const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: debug
 * /mobile/get/students:
 *   get:
 *     summary: Get all students from the database (for debug purposes)
 *     tags: [debug]
 *     responses: 
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the student
 *                       name:
 *                         type: string
 *                         description: Name of the student
 *                       age:
 *                         type: integer
 *                         description: Age of the student
 *       500:
 *         description: Internal server error
 */

router.get('/get/students', async (req, res) => {
    const pool = req.db;
    let query = 'SELECT * FROM student';
    const values = [];
    const result = await pool.query(query, values);
    // console.log(result)
    res.json({rows: result.rows});
  });

/**
 * @swagger
 * tags:
 *   name: debug
 * /mobile/get/users:
 *   get:
 *     summary: Get all users from the database (for debug purposes)
 *     tags: [debug]
 *     responses: 
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the user
 *                       username:
 *                         type: string
 *                         description: Username of the user
 *                       email:
 *                         type: string
 *                         description: Email address of the user
 *       500:
 *         description: Internal server error
 */

router.get('/get/users', async (req, res) => {
    const pool = req.db;
    let query = 'SELECT * FROM users';
    const values = [];
    const result = await pool.query(query, values);
    console.log("req recieved.")
    res.status(200).send({rows: result.rows});
  });

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     GetStudent:
 *       example:
 *         id: 13
*/