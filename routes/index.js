const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { Strategy, ExtractJwt } = passportJWT;

// Load secret key from environment variable
const secretKey = process.env.JWT_SECRET_KEY;

// Configure Passport to use JWT strategy
passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey
}, (jwtPayload, done) => {
  // Here you would typically find the user from database
  // Example: User.findById(jwtPayload.userId, (err, user) => {
  //   if (err) return done(err, false);
  //   if (user) return done(null, user);
  //   return done(null, false);
  // });
}));

// Generate JWT token
function generateToken(user) {
  return jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '1h' });
}

/**
 * @swagger
 * /loginn:
 *   post:
 *     summary: Logs in the user and returns a JWT token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
router.post('/loginn', (req, res) => {
  // Assuming you have the user object after successful authentication
  const user = { userId: 1 }; // Example user object
  // Generate JWT token
  const token = generateToken(user);
  // Send token back to the client
  res.json({ token });
});

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access a protected route with JWT authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success message
 *       401:
 *         description: Unauthorized
 */

module.exports = router;
