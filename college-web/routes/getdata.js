require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');

router.post('/bulk', verifyToken('college'), async (req, res) => {
    console.log(req.body);

    res.status(200).send("Thanks for sharing");
});

module.exports = router;
