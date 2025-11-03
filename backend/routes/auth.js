const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController'); // ✅ lowercase matches your file
const { protect } = require('../middleware/authMiddleware');

// Existing endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);

// List roles
router.get('/roles', authController.getRoles);

// Profile routes
router.get('/profile', protect, authController.getProfile);
router.post('/profile', protect, authController.updateProfile);

// ✅ New: Check user verification status
router.get('/status', authController.checkStatus);

module.exports = router;
