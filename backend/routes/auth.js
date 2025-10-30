const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// existing endpoints (keep them)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-otp', AuthController.verifyOtp);

// new: list roles for landing page
router.get('/roles', AuthController.getRoles);

module.exports = router;
