const express = require("express");
const router = express.Router();

const mongodb = require("../dbconfig/db_cred")

router.get("/get-all-services", async (req, res) => {
  try {
    const db = mongodb.getClient().db("bus-pass");
    const busServiceCollection = db.collection("bus-services");
    const allDocuments = await busServiceCollection.find({}).toArray();

    res.status(200).json({ success: true, data: allDocuments });
  } 
  catch (error) {
    console.error('Error fetching "bus-services" collection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/insert-bus-service", async (req, res) => { // not useful only there for refrence and possible future use
  try {
    const db = mongodb.getClient().db("bus-pass");
    const busServiceCollection = db.collection("bus-services");

    const newBusService = req.body;

    const result = await busServiceCollection.insertOne(newBusService);

    res.status(200).json({ success: true, insertedCount: result.insertedCount });
  } 
  catch (error) {
    console.error('Error inserting into "bus-service" collection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
