const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Set up Multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where uploaded files will be stored
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filenames for uploaded files using UUID
    const uniqueFilename = uuidv4() + '-' + file.originalname;
    cb(null, uniqueFilename);
  }
});

// Set up Multer instance with storage options
const upload = multer({ storage: storage });

// Middleware function to handle file uploads
const uploadMiddleware = upload.single('file'); // 'file' here is the name attribute of the file input field

module.exports = uploadMiddleware;
