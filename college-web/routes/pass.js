require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');

/**
 * //account/:whattodo (reject/forward/restore)
 * //account/get/:whattodo (rejected/forwarded/applied)
 * 
 * [POST]//pass/:id/:whattodo (reject/forward/restore)
 * [GET]//pass/get/:whattodo?type=renew (rejected/forwarded/applied)
 * [POST]/service/pass/:whattodo (accept/reject)
 * [GET]/service/pass/get/:whattodo?type=renew (accepted/rejected)
*/

router.get('/pass/get/:status',verifyToken('college') ,async (req, res) => {
    const {type} = req.query;
    const status = req.params.status;
    const _type = type?true:false;
    console.log(type, _type, status)
    try {
        const passesQuery = await req.db.query(`SELECT f.*, s.* FROM student AS s
        JOIN form AS f ON f.id=s.form_id WHERE s.college=$1`, [req.user.id]);
        res.status(200).send(passesQuery.rows);
    } catch(e) {
        res.status(200).send("internal server error");
    }
});
router.post('/form/:studentid/:action',verifyToken('college') , async (req, res) => {
    const studentid = req.params.studentid;
    const action = req.params.action;
    try {
        const formQuery = await req.db.query(`UPDATE form SET status=$1 WHERE userid=$2`, [action,studentid]);
        if(formQuery.rowCount === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send({form_set_to: action, student_id: studentid});
        }
    } catch (e) {
        res.status(500).send("Internal server error");
    }
});


module.exports = router;