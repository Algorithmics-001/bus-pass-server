require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');

/**
 * [POST]//account/:status (reject/accept/restore)
 * [GET]//account/get/:status (rejected/applied/accepted)
*/

/**
 * @swagger
 * /api/college/account/{userid}/{status}:
 *   post:
 *     summary: Update account status
 *     description: Update the user account status based on the provided user ID and status.
 *     tags:
 *       - Account
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose account status will be updated.
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: The new status to set for the user account (accept, reject, etc.).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account status updated successfully.
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */


router.post('/account/:userid/:status', verifyToken('college'), async (req, res) => {
    const userid = req.params.userid;
    var status = req.params.status;
    status = (status==='accepted')?'student':status;
    console.log(status);
    try {
        const accountStatusQuery = await req.db.query(`UPDATE users AS u
        SET usertype = $1
        FROM student AS s
        WHERE u.userid = s.userid
        AND s.college = $2
        AND u.userid=$3;
        `, [status, req.user.id, userid])
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});



/**
 * @swagger
 * /api/college/account/get/{status}:
 *   get:
 *     summary: Get accounts based on status
 *     description: Retrieve user accounts based on the provided status for students of the authenticated college.
 *     tags:
 *       - Account
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: The status of the accounts to retrieve (rejected, applied, accepted).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user accounts matching the provided status.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
//[GET]//account/get/:status (rejected/applied/accepted)
router.get('/account/get/:status', verifyToken('college'), async (req,res) => {
    var status = req.params.status;
    status = (status==='accepted')?'student':status;
    console.log(status);
    const _status = (status)?true:false;
    try {
        if(_status) {
            const accountsQuery  = await req.db.query(`SELECT s.*, u.username, u.name FROM student AS s
            JOIN users AS u ON u.userid=s.userid AND u.usertype=$1 AND s.college=$2`,
            [status, req.user.id]);
            return res.status(200).send(accountsQuery.rows);
        } else {
            return req.status(401).send("Missing status");
        }

    } catch (e) {
        return res.status(500).send("Internal server error");
    }

});


module.exports = router;