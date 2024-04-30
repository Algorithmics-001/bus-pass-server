require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');


router.post('/bulk/:action', async (req, res) => {
    const action = req.params.action;
    const emails = req.body;
    // Constructing the SQL query dynamically
    const emailList = Object.keys(emails).map(email => `'${email}'`).join(',');
    //WHERE email IN (${emailList})
    const query = `UPDATE form AS f
    SET status = $1
    FROM student AS s
    JOIN users AS u ON u.userid = s.userid
    WHERE f.student_id = s.id
    AND u.email IN (${emailList})
    `;
    try {
        await req.db.query(query, [action]);
        res.status(200).send("Bulk update successful");
    } catch (error) {
        console.error("Error occurred during bulk update:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
