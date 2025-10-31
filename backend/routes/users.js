const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { protect } = require('../middleware/authMiddleware');

// list users (optionally filter by role key)
router.get('/', protect, UserController.list);
router.get('/:id', protect, UserController.get);

module.exports = router;
