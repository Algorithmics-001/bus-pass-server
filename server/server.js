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


app.post('/signup', async (req, res) => {

  const pool = await getDatabasePool();
  try {
    const signupData = req.body;
    console.log(signupData);
    const userexist = false;
    pool.query(`SELECT * FROM users WHERE username='${signupData.email}'`, (err, r) => {
      if (r.rowCount > 0) {
        return res.send({
          message: "User already exists.",
          type: "error"
        });
      }
    });
    pool.query(`INSERT INTO users(username, password, name) VALUES(
'${signupData.email}',
'${signupData.password}',
'${signupData.name}'
)`, (err, r) => {
      res.send({
        message: "Congratulations, Account Created Successfully!",
        type: "success"
      });
    });
  } catch (error) {
    console.error('Error saving user:', error);

    res.status(500).send('Internal Server Error');
  }
});


app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
