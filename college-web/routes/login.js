require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const {verifyToken} = require('../modules/auth.js');

function generateToken(user) {
  return jwt.sign({id: user.userid, name: user.name,email: user.username , type: user.usertype}, secretKey, { expiresIn: '1h' });
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
 *              name: John Done
 *              id: 12345
 *       500:
 *         description: Some server error
 *
 */
router.post('/login', async (req, res) => {
  const pool = req.db;
  const loginData = req.body;
  const requiredFields = ['email', 'password'];
  const fields = req.checkFields(requiredFields);
  if(fields.status==false) {
    return res.status(500).send(fields.message);
  }
  try {
      const query = {
          text: "SELECT userid,name,usertype,username,(password_hash = crypt($2, password_hash)) AS password_correct FROM users WHERE username = $1;",
          values: [loginData.email, loginData.password]
      };
      const result = await pool.query(query);
      if (result.rowCount == 1 && result.rows[0].password_correct == true) {
          const username = result.rows[0].name;
          const id = result.rows[0].userid;
          const user = result.rows[0];
          const token = generateToken(user);
          res.cookie('token', token, { 
            httpOnly: true, // Ensures the cookie is only accessible via HTTP(S) and not client-side scripts
          });
          return res.status(200).send({
              message: `Logged in successfully! username: ${username}`,
              name: username,
              id: id,
          });
      } else {
          return res.status(401).send({
              message: "Username or Password invalid.",
              type: "error"
          });
      }
  } catch (e) {
      console.error('Error executing query:', e);
      return res.status(500).send({e});
  }
});

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Simple account creation, deletion, login, etc.
 * /logout:
 *   post:
 *     summary: Logout endpoint
 *     tags: [LogOut]
 *     description: Clears the authentication token, logging the user out.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Logged out successfully
 *       500:
 *         description: Some server error
 */

router.post('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0) });
  res.status(200).send({ message: 'Logged out successfully' });
});

  
router.get('/protected', verifyToken('college'), (req, res) => {
  console.log(req.user);
  res.json({ message: `Protected route accessed successfully by: ${req.user.name}, email: ${req.user.email}, type: ${req.user.type}` });
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
 *         email: john.doe123@example.com
 *         password: password123
*/
module.exports = router;
