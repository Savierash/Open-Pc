// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const User = require('../models/Users');

// ✅ Admin: Edit any user's data (except techId)
router.patch('/users/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const allowed = {};
    const allowedFields = ['username', 'address', 'contactNumber', 'role', 'avatar'];
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) allowed[f] = req.body[f];
    });

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: allowed },
      { new: true }
    ).select('-password');

    return res.json({ message: 'User updated', user: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Admin update failed', error: err.message });
  }
});

module.exports = router;
