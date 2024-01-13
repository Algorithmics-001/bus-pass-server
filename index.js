// app.js
const express = require("express");
const app = express();
const cors = require("cors");

// routes
const studentRoutes = require("./routes/student"); 
const collegesRoutes = require("./routes/colleges");
const busServicesRoutes = require("./routes/bus-services")

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/student", studentRoutes);
app.use("/colleges", collegesRoutes);
app.use("/bus-services", busServicesRoutes);

app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
});
