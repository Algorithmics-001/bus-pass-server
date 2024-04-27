require('dotenv').config(); // NEVER forget to load dotenv.

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cors()); // for cross origin
app.use(express.json()); //for res.json (if im not wrong)
app.use(cookieParser()); //to parse cookies. usage: req.cookies.COOKIE_NAME

const uploadMiddleware = require('./modules/upload.js'); // for uploading files
app.use(uploadMiddleware);


//db config
const { attachDatabasePool } = require('./db.js');
app.use(attachDatabasePool); //usage example: await req.db.query('SELECT 1');

// module to check for missing fields, providing it with an array.
const {attachCheckFields} = require('./modules/checkfields.js');
app.use(attachCheckFields);
/**
 * Usage:
 * const requiredFields = ['field1', 'field2', 'etc'];
 * const fields = req.checkFields(requiredFields);
 * Response upon missing:
 * {
 *   status: false,
 *   message: 'Missing fields: batch, aadhar_number, college'
 * }
**/


//routers from /routes folder
const signupRouter = require('./routes/signup.js'); 
const tempRouter = require('./routes/temporary.js');
const loginRouter = require('./routes/login.js');
const applyRouter = require('./routes/apply.js');
const getRouter = require('./routes/getdata.js');
const dummyRouter = require('./routes/dummy.js');
app.use('/mobile', signupRouter);
app.use('/mobile', loginRouter);
app.use('/mobile', tempRouter);
app.use('/mobile', applyRouter);
app.use('/mobile', getRouter);
app.use('/mobile', dummyRouter);




//swagger configuration
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
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
  "/mobile/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// running the server
app.listen(process.env.BUSPASS_SERVER_MOBILE_API_PORT, () => {
  console.log(`Server is running on port ${process.env.BUSPASS_SERVER_MOBILE_API_PORT}.`);
});