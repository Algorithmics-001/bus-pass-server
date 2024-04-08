require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');


router.get('/requests',verifyToken('college'), async (req, res) => {
    const id = req.user.id;

    const requestsQuery = `SELECT f.id, f.status, f.from_bus_stop, f.to_bus_stop, f.bus_deport_id, f.renewal, f.from_date, f.to_date, f.student_id
    FROM form AS f
    JOIN student AS s ON s.userid=f.student_id
    WHERE s.`

});


module.exports = router;
