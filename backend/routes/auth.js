const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { protect } = require('../middleware/authMiddleware');

// existing endpoints (keep them)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// new: list roles for landing page
router.get('/roles', AuthController.getRoles);
// profile routes
router.get('/profile', protect, AuthController.getProfile);
router.post('/profile', protect, AuthController.updateProfile);

module.exports = router;
