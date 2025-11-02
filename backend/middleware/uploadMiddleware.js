// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ✅ Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ✅ Unique filename
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // ✅ Accept image
  } else {
    cb(new Error("Only image files are allowed!"), false); // ❌ Reject non-image file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // ✅ Limit to 2MB
});

module.exports = upload;
