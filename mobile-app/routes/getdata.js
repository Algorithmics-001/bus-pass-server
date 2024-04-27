require('dotenv').config();
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../modules/auth.js');
const fs = require('fs');
const path = require('path');

/**
 * @swagger
 * /mobile/get/student:
 *   get:
 *     summary: Retrieve student information
 *     description: Retrieves information about the logged-in student.
 *     tags:
 *       - Student
 *     security:
 *       - bearerAuth: []
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     course:
 *                       type: string
 *                     year:
 *                       type: integer
 *                     batch:
 *                       type: string
 *                     semester:
 *                       type: integer
 *                     department:
 *                       type: string
 *                     aadhar_number:
 *                       type: string
 *                     college:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     rollno:
 *                       type: string
 *                     userid:
 *                       type: string
 *                     father_name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     admission_date:
 *                       type: string
 *                       format: date
 *                     email:
 *                       type: string
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '500':
 *         description: Internal Server Error
 */


router.get('/get/student',verifyToken('student'), async (req, res) => {
    const id = req.user.id;
    console.log(id);
    const pool = req.db;
      try {
      const getStudentQuery = `SELECT
        name,
        course,
        year,
        batch,
        semester,
        department,
        aadhar_number,
        college,
        phone_number,
        rollno,
        userid,
        father_name,
        address,
        admission_date,
        email
      FROM student WHERE userid=$1;
    `;
    const getStudentParameters = [id];
    result = await pool.query(getStudentQuery, getStudentParameters);
    rows = result.rows[0];
    res.status(200).send({
        rows
      });

      } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send(error);
      }
});

router.get('/get/status',verifyToken('student'), async (req, res) => {
  res.send("test");
});


/**
 * @swagger
 * /mobile/upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file to the server
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         description: The file to upload
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filename:
 *                   type: string
 *                   description: The filename of the uploaded file on the server
 *                 originalName:
 *                   type: string
 *                   description: The original filename of the uploaded file
 *       400:
 *         description: No file uploaded
 */
router.post('/upload/:doctype' , verifyToken('student'), async (req, res) => {
  const doctype = req.params.doctype;
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  if(!doctype) {
    return res.status(400).send("No doctype specified.");
  }
  const filename = req.file.filename;
  const originalName = req.file.originalname;
  try {
    const insertDocumentQuery = `
  INSERT INTO documents(id, name, type) 
  VALUES ($1, $2, $3)
  ON CONFLICT (id, type) DO UPDATE
  SET name = EXCLUDED.name;`;
  const insertDocumentParameters = [req.user.id, req.file.filename, doctype];


    const insertDocumentRequest = await req.db.query(insertDocumentQuery, insertDocumentParameters);
    return res.json({ filename, originalName });
  } catch (e) {
    return res.status(500).send({error: "Internal Server Error."})
  }
});


/**
 * @swagger
 * /mobile/documents/{doctype}:
 *   get:
 *     summary: Get document by type
 *     description: Retrieve a document by its type for the authenticated user.
 *     parameters:
 *       - in: path
 *         name: doctype
 *         required: true
 *         description: The type of the document to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The requested document.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized. Missing or invalid authentication token.
 *       404:
 *         description: The requested document or user's document of the specified type does not exist.
 *       500:
 *         description: Internal server error.
 */
router.get('/documents/:doctype', verifyToken('student'), async (req, res) => {
  const doctype = req.params.doctype;
  try {
      const filename_query = await req.db.query("SELECT name FROM documents WHERE id=$1 AND type=$2",
      [req.user.id, doctype]);
      console.log(req.user.id, doctype)
      if(filename_query.rowCount === 0) {
        return res.status(404).send("No files.");
      } else {
        const filePath = path.resolve(__dirname, '..', 'uploads', filename_query.rows[0].name);
        console.log(filePath)
        fs.access(filePath, fs.constants.R_OK, (err) => {
          if (err) {
            // File not found or not readable
            return res.status(404).send('File not found.');
          }
          // Stream the file to the response
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        });
      }
  } catch(e) {
      return res.status(500).send("Internal server error.");
  }


  // Check if the file exists
});


module.exports = router;
