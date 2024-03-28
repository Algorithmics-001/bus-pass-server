require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getDatabasePool } = require('../db.js');
const {verifyToken} = require('../modules/auth.js');
const axios = require('axios');


async function sendToDiscord(message) {
  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message
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
 * /student/apply:
 *   post:
 *     summary: Apply for student admission
 *     description: Endpoint to submit a student admission application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fatherName:
 *                 type: string
 *               residentAddress:
 *                 type: string
 *               busStopCity:
 *                 type: string
 *               hostelDetails:
 *                 type: string
 *               occupation:
 *                 type: string
 *               scholarship:
 *                 type: string
 *               admissionDate:
 *                 type: string
 *                 format: date
 *               departurePlace:
 *                 type: string
 *               arrivalPlace:
 *                 type: string
 *               collegeName:
 *                 type: string
 *               collegeAddress:
 *                 type: string
 *               busStopName:
 *                 type: string
 *               state:
 *                 type: string
 *               district:
 *                 type: string
 *               month:
 *                 type: object
 *                 properties:
 *                   fromDate:
 *                     type: string
 *                     format: date
 *                   toDate:
 *                     type: string
 *                     format: date
 *               collegedistrict:
 *                 type: string
 *               collegestate:
 *                 type: string
 *               postalcode:
 *                 type: string
 *               homepostalcode:
 *                 type: string
 *               homestate:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully submitted student application
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: success
 */


router.post('/student/apply', async (req, res) => {
    await sendToDiscord(`[POST]/student/apply
    ${JSON.stringify(req.body)}`);
    res.status(200).send("success")
});
  
module.exports = router;
