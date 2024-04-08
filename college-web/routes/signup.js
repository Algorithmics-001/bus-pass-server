const express = require('express');
const router = express.Router();
async function sendToTelegram(message) {
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
 * /college/signup:
 *   post:
 *     summary: Signup endpoint for creating a new user account.
 *     description: This endpoint allows users to sign up by providing their information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               affiliation_number:
 *                 type: integer
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *             example:
 *               name: GNDEC
 *               affiliation_number: 69
 *               phone_number: +1234567890
 *               password: password123
 *               username: gne
 *               address: 123 Street, City, Country
 *     responses:
 *       '200':
 *         description: Successfully created a new account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Congratulations, Account Created Successfully!
 *                 id:
 *                   type: integer
 *                   example: 123
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/signup', async (req, res) => {
  const {
    name,
    phone_number,
    bus_service_id,
    affiliation_number,
    username,
    password,
    address
} = req.body;
    const requiredFields = [
      'name',
      'username',
      'password',
      'address'
    ];
    const fields = req.checkFields(requiredFields);
    if(fields.status==false) {
      return res.status(400).send(fields.message);
    }

    const client = await req.db.connect();
    try {
      const userExistQuery = 'SELECT * FROM users WHERE username = $1';
      const userExistValues = [username];
      await client.query('BEGIN');
      const existingUser = await client.query(userExistQuery, userExistValues);
      if (existingUser.rowCount > 0) {
        return res.send({
          message: "User already exists.",
          type: "error"
        });
      }
    // Insert into users table and retrieve the inserted user's ID
    const insertUserQuery = `INSERT INTO users(username, password_hash, name, usertype)
    VALUES ($1, crypt($2, gen_salt('bf')), $3, $4)
    RETURNING userid;`;
    const insertUserValues = [username, password, name, 'college'];
    const { rows } = await client.query(insertUserQuery, insertUserValues);
    const userid = rows[0].userid;
    // console.log(userid)


    const insertCollegeQuery = `INSERT INTO college(
     name,
     phone_number,
     bus_service_id, 
     address,
     affiliation_number
    )
    VALUES($1,$2,$3,$4,$5) RETURNING id;
`;
const insertCollegeParams = [
    name,
    phone_number,
    bus_service_id,
    address,
    affiliation_number
];
    await client.query(insertCollegeQuery, insertCollegeParams);
      res.status(200).send({
        message: 'Congratulations, Account Created Successfully!',
        id: userid
    });
    await client.query('COMMIT'); // Commit transaction
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).send({error: error});
    } finally {
      client.release();
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupData:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - course
 *         - batch
 *         - semester
 *         - rollno
 *         - department
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: Name of the student.
 *         username:
 *           type: string
 *           description: username address of the student.
 *         password:
 *           type: string
 *           description: Password for the student's account.
 *         course:
 *           type: string
 *           description: Course in which the student is enrolled.
 *         batch:
 *           type: integer
 *           description: Year of batch for the student.
 *         semester:
 *           type: integer
 *           description: Current semester of the student.
 *         rollno:
 *           type: integer
 *           description: Roll number of the student.
 *         department:
 *           type: string
 *           description: Department in which the student is studying.
 *         phone:
 *           type: string
 *           description: Phone number of the student.
 *
 *       example:
 *         name: Amrinder Singh
 *         email: test@example.com
 *         password: Str0Ngp@ssWO4D
 *         course: inter
 *         batch: 2025
 *         semester: 3
 *         rollno: 123456
 *         department: CSE
 *         phone: 123456789
*/
module.exports = router;
