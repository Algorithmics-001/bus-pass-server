const express = require("express");
const router = express.Router();

const mongodb = require("../dbconfig/db_cred")

router.get("/get-all-colleges", async (req, res) => {
  try {
    const db = mongodb.getClient().db("bus-pass");
    const busServiceCollection = db.collection("colleges");
    const allDocuments = await busServiceCollection.find({}).toArray();

    res.status(200).json({ success: true, data: allDocuments });
  } 
  catch (error) {
    console.error('Error fetching "colleges" collection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post("/insert-college", async (req, res) => { // not useful only there for refrence and possible future use
  try {
    const db = mongodb.getClient().db("bus-pass");
    const busServiceCollection = db.collection("colleges");

    const newCollege = req.body;

    const result = await busServiceCollection.insertOne(newCollege);

    res.status(200).json({ success: true, insertedCount: result.insertedCount });
  } 
  catch (error) {
    console.error('Error inserting into "colleges" collection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

  