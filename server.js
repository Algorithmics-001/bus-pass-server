require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { redirect } = require('react-router-dom');
const app = express();
const { getDatabasePool } = require('./db.js');

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

/*
[x] Name
[x] Email = username in db
[x] Password
Course
Batch
Semester
RollNumber
Department
Phone Number
*/
app.get('/signup', async (req, res) => {
  const { name, email, password, course, batch, semester, rollno, department, phone } = req.query;
  // console.log(req.query)
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

    res.send({
      message: "Congratulations, Account Created Successfully!",
      type: "success"
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/get/students', async (req, res) => {
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