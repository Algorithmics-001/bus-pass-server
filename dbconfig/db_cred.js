// mongodb.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://gne-devs:weakpassword@cluster0.xp4euft.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; 
  }
}

async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log("Closed MongoDB connection.");
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error; 
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  getClient: () => client
};
