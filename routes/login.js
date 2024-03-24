require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getDatabasePool } = require('../db.js');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { Strategy, ExtractJwt } = passportJWT;
const secretKey = process.env.JWT_SECRET_KEY;
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    console.log(decoded);
    next();
  });
}

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey
}, (jwtPayload, done) => {
  console.log("STRATEGY CALLED LOL")
  /*const pool = await getDatabasePool();
  try {
    const query = {
      text: "SELECT userid, name, username, usertype FROM users WHERE userid = $1;",
      values: [jwtPayload.userId]
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return done(null, false);
    }

    const user = result.rows[0];
    return done(null, user);
  } catch (err) {
    return done(err);
  }*/
}));

function generateToken(user) {
  return jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '1h' });
}

/*
(async function(username, password, cb) {
  const pool = await getDatabasePool();
  try {
    const query = {
      text: "SELECT userid, name, username, usertype, (password_hash = crypt($2, password_hash)) AS password_correct FROM users WHERE username = $1;",
      values: [username, password]
    };
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0 || !result.rows[0].password_correct) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    const user = result.rows[0];
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
})
*/



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
 *              name: John Done
 *              id: 12345
 *       500:
 *         description: Some server error
 *
 */
router.post('/login', async (req, res) => {
  const pool = await getDatabasePool();
  const loginData = req.body;
  console.log(loginData);
  
  try {
      const query = {
          text: "SELECT userid,name,(password_hash = crypt($2, password_hash)) AS password_correct FROM users WHERE username = $1;",
          values: [loginData.email, loginData.password]
      };

      const result = await pool.query(query);
      // console.log(result);
      if (result.rows[0].password_correct == true) {
          const username = result.rows[0].name;
          const id = result.rows[0].userid;
          const user = result.rows[0];
          const token = generateToken(user);
          console.log(token);
          res.cookie('token', token, { 
            httpOnly: true, // Ensures the cookie is only accessible via HTTP(S) and not client-side scripts
          });
          return res.status(200).send({
              message: `Logged in successfully! username: ${username}`,
              name: username,
              id: id
          });
      } else {
          return res.send({
              message: "Username or Password invalid.",
              type: "error"
          });
      }
  } catch (e) {
      console.error('Error executing query:', e);
      return res.send({
          message: "An error occurred.",
          type: "error"
      });
  }
});
  
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
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
