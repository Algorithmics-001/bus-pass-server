require('dotenv').config();
const express = require('express');
const otpGenerator = require('./modules/otpgenerator.js')
const cors = require('cors');
const { redirect } = require('react-router-dom');
const app = express();
const { getDatabasePool } = require('./db.js');
const   bodyParser = require("body-parser");
const signupRouter = require('./routes/signup.js'); 
const tempRouter = require('./routes/temporary.js');
const loginRouter = require('./routes/login.js');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(cors());
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Bus Pass API documentation.",
      version: "0.1.0",
      description:
        "API documentation for the bus pass project."
    },
    servers: [
      {
        url: process.env.ENDPOINT_URL,
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

app.use(express.json());


app.get('/message', (req, res) => {
  res.json({ message: "Search Projects From Database" });
});
app.use('/', signupRouter);
app.use('/', loginRouter);
app.use('/', tempRouter);


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