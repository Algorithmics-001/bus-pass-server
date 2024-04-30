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
        console.log(e);
        res.status(200).send("internal server error");
    }
});


/**
 * @swagger
 * /api/college/pass/{action}:
 *   post:
 *     summary: Update form status for a student
 *     description: Update the status of a form for a student based on the action provided.
 *     tags:
 *       - Form
 *     parameters:
 *       - in: path
 *         name: action
 *         schema:
 *           type: string
 *         required: true
 *         description: The action to be performed on the form status (e.g., "approved", "rejected").
 *       - in: query
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student whose form status is to be updated.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated form status and the student ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 form_set_to:
 *                   type: string
 *                   description: The status the form was set to.
 *                 student_id:
 *                   type: string
 *                   description: The ID of the student whose form status was updated.
 *       '404':
 *         description: User not found. The provided student ID does not exist in the database.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       '500':
 *         description: Internal server error. An unexpected error occurred while processing the request.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.post('/pass/:action', verifyToken('college'), async (req, res) => {
    const { userid } = req.query;
    const { action } = req.params;
    console.log(userid, action);
    try {
        const formQuery = await req.db.query('UPDATE form SET status = $1 WHERE student_id = $2', [action, userid]);
        if (formQuery.rowCount === 0) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send({ form_set_to: action, student_id: userid });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;