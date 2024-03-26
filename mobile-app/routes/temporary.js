const express = require('express');
const router = express.Router();
const { getDatabasePool } = require('../db.js');

/**
 * @swagger
 * tags:
 *   name: debug
 * /get/students:
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
    const pool = await getDatabasePool();
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
 * /get/users:
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
    const pool = await getDatabasePool();
    let query = 'SELECT * FROM users';
    const values = [];
    const result = await pool.query(query, values);
    console.log("req recieved.")
    res.status(200).send({rows: result.rows});
  });

/**
 * @swagger
 * tags:
 *   name: debug
 * /student/get:
 *   get:
 *     summary: Get student information by ID from the database (for debug purposes)
 *     tags: [debug]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of the student to retrieve
 *         schema:
 *           type: integer
 *     responses: 
 *       200:
 *         description: Student information retrieved successfully
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
 *       400:
 *         description: Bad request, ID parameter is missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get('/student/get', async (req, res) => {
const {id} = req.query;
const pool = await getDatabasePool();
let query = 'SELECT * FROM student WHERE id=$1';
const values = [id];
const result = await pool.query(query, values);
console.log(result)
res.json({rows: result.rows});
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