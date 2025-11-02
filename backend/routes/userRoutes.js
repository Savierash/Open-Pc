// backend/routes/userRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateUser, uploadProfileImage } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// ✅ Multer storage for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profilePics/'),
  filename: (req, file, cb) => cb(
    null,
    `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
  ),
});
const upload = multer({ storage });

// ✅ GET - Logged in user info
router.get('/me', protect, getMe);

// ✅ PUT - Update user details (address, contact number)
router.put('/update', protect, updateUser);

// ✅ POST - Upload profile image
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
