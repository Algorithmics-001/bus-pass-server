require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');

/**
 * //account/:status (reject/accepted/restore)
 * 
 * [GET]//pass/get/:whattodo?type=renew (rejected/forwarded/applied)
 * [POST]/service/pass/:whattodo (accept/reject)
 * [GET]/service/pass/get/:whattodo?type=renew (accepted/rejected)
*/
/**
 * @swagger
 * /api/college/pass/get/{status}:
 *   get:
 *     summary: Get passes based on status
 *     description: Retrieve passes based on status for students of the authenticated college.
 *     tags:
 *       - Passes
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: The status of the passes to retrieve.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Optional parameter to filter passes by type.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of passes matching the provided status.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pass'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

 //account/get/:status (rejected/applied/accepted)

router.get('/pass/get/:status',verifyToken('college') ,async (req, res) => {
    const {type} = req.query;
    const status = req.params.status;
    console.log(status);
    const _type = type?true:false;
    console.log(type, _type, status)
    try {
        const passesQuery = await req.db.query(`SELECT f.*, s.* FROM student AS s
        JOIN form AS f ON f.id=s.form_id WHERE s.college=$1 AND f.renewal=$2 AND f.status=$3`, [req.user.id, _type, status]);
        res.status(200).send(passesQuery.rows);
    } catch(e) {
        res.status(200).send("internal server error");
    }
});


/**
 * @swagger
 * /api/college/pass/{userid}/{action}:
 *   post:
 *     summary: Update form status
 *     description: Update the status of a form for a specific student.
 *     tags:
 *       - Forms
 *     parameters:
 *       - in: path
 *         name: studentid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student whose form status will be updated.
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *         description: The new status to set for the form.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The form status has been successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 form_set_to:
 *                   type: string
 *                 student_id:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

// * [POST]//pass/:id/:whattodo (rejected/forward/applied)
router.post('/pass/:userid/:action',verifyToken('college') , async (req, res) => {
    const userid = req.params.userid;
    const action = req.params.action;
    try {
        const formQuery = await req.db.query(`UPDATE form SET status=$1 WHERE userid=$2`, [action,userid]);
        if(formQuery.rowCount === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send({form_set_to: action, student_id: userid});
        }
    } catch (e) {
        res.status(500).send("Internal server error");
    }
});


module.exports = router;