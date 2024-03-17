require('dotenv').config();
const express = require('express');
const otpGenerator = require('./modules/otpgenerator.js')
const cors = require('cors');
const { redirect } = require('react-router-dom');
const app = express();
const { getDatabasePool } = require('./db.js');
const   bodyParser = require("body-parser");
const signupRouter = require('./routes/signup.js'), 
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
  apis: ["./routes/*"],
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
app.use('/', signupRouter);
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