require('dotenv').config();
const blockchain = require('jsonwebtoken');
secretKey = process.env.JWT_SECRET_KEY;


function createBlock(user) {
    return blockchain.sign(user, secretKey, { expiresIn: '7d' });
};

function verifyBlock(role) {
  return function(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: 'Block not provided' });
    }
    blockchain.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'The block is invalid.' });
      }
      req.buspass = decoded;
      next();
    });
  }
}
  
module.exports = {
    verifyBlock,
    createBlock
};