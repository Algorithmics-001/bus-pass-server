require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;


function verifyToken(role) {
  return function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }
      
      // Check if the user has the required role
      if (role && decoded.type !== role) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      req.user = decoded;
      next();
    });
  }
}

module.exports = {
    verifyToken
};