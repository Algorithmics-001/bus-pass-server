require('dotenv').config();
const express = require('express');
const otpGenerator = require('./modules/otpgenerator.js')
const cors = require('cors');
const { redirect } = require('react-router-dom');
const app = express();
const { getDatabasePool } = require('./db.js');
const   bodyParser = require("body-parser"),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger"
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["server.js"],
};


const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use(cors());
app.use(express.json());


app.get('/message', (req, res) => {
  res.json({ message: "Search Projects From Database" });
});

app.post('/login', async (req, res) => {
  const loginData = req.body;
  console.log(loginData);
  const pool = await getDatabasePool();
  var username;
  let id;
  try {
    pool.query(`SELECT * FROM users WHERE username='${loginData.email}' AND password='${loginData.password}'`, (err, r) => {
      console.log(r.rowCount);
      if (r.rowCount != 0) {
        username = r.rows[0].name;
        id = r.rows[0].userid;
        return res.send({
          message: `Logged in successfully! username: ${username}`,
          type: "success",
          name: `${username}`,
          id: `${id}`
        })
      } else {
        return res.send({
          message: "Username or Password invalid.",
          type: "error"
        })
      }
    });
  }
  catch (e) {
    return res.send({
      message: "Username or Password invalid.",
      type: "error"
    })
  }
});

function checkMissingFields(query) {
  const requiredFields = ['name', 'email', 'password', 'course', 'batch', 'semester', 'rollno', 'department', 'phone'];
  const missingFields = [];
  requiredFields.forEach(field => {
    if (!query[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return {
      status: false,
      message: `Missing fields: ${missingFields.join(', ')}`
    };
  } else {
    return {
      status: true
    };
  }
}


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
 *         email:
 *           type: string
 *           description: Email address of the student.
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

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Simple account creation, deletion, login etc.
 * /signup:
 *   post:
 *     summary: simple signup endpoint
 *     tags: [SignUp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupData'
 *     responses:
 *       200:
 *         description: Congratulations, Account Created Successfully!
 *         content:
 *           application/json:
 *             example:
 *              message: Congratulations, Account Created Successfully!
 *              id: 132456
 *       500:
 *         description: Some server error
 *
 */
app.post('/signup', async (req, res) => {
  const { name, email, password, course, batch, semester, rollno, department, phone } = req.body;
  fields = checkMissingFields(req.body);
  if(fields.status==true) {
  const pool = await getDatabasePool();
  try {
    const userExistQuery = 'SELECT * FROM users WHERE username = $1';
    const userExistValues = [email];
    const existingUser = await pool.query(userExistQuery, userExistValues);

    if (existingUser.rowCount > 0) {
      return res.send({
        message: "User already exists.",
        type: "error"
      });
    }

  // Insert into users table and retrieve the inserted user's ID
  const insertUserQuery = 'INSERT INTO users(username, password, name, usertype) VALUES($1, $2, $3, $4) RETURNING userid';
  const insertUserValues = [email, password, name, 'student'];
  const { rows } = await pool.query(insertUserQuery, insertUserValues);
  const userid = rows[0].userid;
  console.log(userid)
  const insertStudentQuery = 'INSERT INTO student(name, course, batch, semester, rollno, department, phone_number, userid) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
  const insertStudentValues = [name, course, batch, semester, rollno, department, phone, userid];
  await pool.query(insertStudentQuery, insertStudentValues);
    res.status(200).send({
      message: 'Congratulations, Account Created Successfully!',
      id: userid
  });

  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Internal Server Error');
  }

  } else {
    res.status(500).send({
      message: fields.message
    });
  }
});


app.get('/get/students', async (req, res) => {
  const otp1 = otpGenerator.generate(6);
  console.log(otp1);
  const pool = await getDatabasePool();
  let query = 'SELECT * FROM student';
  const values = [];
  const result = await pool.query(query, values);
  // console.log(result)
  res.json({rows: result.rows});
});

app.get('/post/student', async (req, res) => {
  const {name, email, password} = req.query;
  console.log(name, email, password);
  const pool = await getDatabasePool();
  const query = `INSERT INTO student(name, email, password) VALUES($1, $2, $3) returning id;`
  const values = [name, email, password];
  const result = await pool.query(query, values);
    console.log(result)
    res.json({id: result.rows[0].id});
});

app.get('/student/apply', async (req, res) => {
  const {id, name, rollno, course, year, batch, semester, department, phone_number} = req.query;
  console.log(name, rollno, course, year, batch, semester, department, phone_number);
  const pool = await getDatabasePool();
  const query = `UPDATE student
  SET rollno=$1, course=$2, year=$3, batch=$4, semester=$5, department=$6, phone_number=$7 WHERE id=$8`
  const values = [rollno, course, year, batch, semester, department, phone_number, id];
  const result = await pool.query(query, values);
    // console.log(result)
    res.json({test: "success"});
});

app.get('/student/get', async (req, res) => {
  const {id} = req.query;
  const pool = await getDatabasePool();
  let query = 'SELECT * FROM student WHERE id=$1';
  const values = [id];
  const result = await pool.query(query, values);
  console.log(result)
  res.json({rows: result.rows});
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});


/*
  let query = 'SELECT * FROM student';
  const values = [];
  const result = await pool.query(query, values);
  // console.log(result)
  res.json({rows: result.rows});
*/