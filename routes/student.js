const express = require("express");
const router = express.Router();

const mongodb = require("../dbconfig/db_cred")

router.get("/get-student-by-id", async (req, res) => {
  try {
    const db = mongodb.getClient().db("bus-pass");
    const busServiceCollection = db.collection("student");

    const studentID = req.query.studentID

    const query = studentID ? {studentID: studentID} : {}

    const allDocuments = await busServiceCollection.find(query).toArray();

    res.status(200).json({ success: true, data: allDocuments });
  } 
  catch (error) {
    console.error('Error fetching "student" collection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post("/insert-student", async (req, res) => { // not useful only there for refrence and possible future use
  try {
    const db = mongodb.getClient().db("bus-pass");
    const busServiceCollection = db.collection("student");

    const newStudent = req.body;

    const result = await busServiceCollection.insertOne(newStudent);

    res.status(200).json({ success: true, insertedCount: result.insertedCount });
  } 
  catch (error) {
    console.error('Error inserting into "student" collection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

  