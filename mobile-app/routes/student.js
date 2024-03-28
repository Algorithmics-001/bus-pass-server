require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getDatabasePool } = require('../db.js');
const {verifyToken} = require('../modules/auth.js');
const axios = require('axios');

async function sendToTelegram(message) {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `message is ${message}`
    })
    .then(response => {
        console.log('Message sent:', response.data);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}


/**
 * @swagger
 * /stud/apply:
 *   post:
 *     summary: Send data to Telegram for application
 *     description: This endpoint sends data to a Telegram channel for application purposes.
 *     tags:
 *       - Application
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Protected route accessed successfully
 */

router.get('/stud/apply', async (req, res) => {
    await sendToTelegram("req.body");
    res.status(200).send({ message: 'Protected route accessed successfully' });
});

module.exports = router;