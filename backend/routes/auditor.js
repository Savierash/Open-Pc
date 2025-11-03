// backend/routes/auditor.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const AuditorController = require('../controllers/AuditorController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profilePics/'),
  filename: (req, file, cb) =>
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });


// Dashboard
router.get('/dashboard', protect, requireRole('auditor'), AuditorController.getDashboard);

// Inventory
router.get('/units', protect, requireRole('auditor'), AuditorController.getUnits);
router.put('/units/:id', protect, requireRole('auditor'), AuditorController.updateUnit);

// Unit Status
router.get('/unit-status', protect, requireRole('auditor'), AuditorController.getUnitStatus);

// Reports
router.get('/reports', protect, requireRole('auditor'), AuditorController.getReports);
router.post('/reports', protect, requireRole('auditor'), AuditorController.createReport);

// Technicians
router.get('/technicians', protect, requireRole('auditor'), AuditorController.getTechnicians);

// Profile
router.get('/profile', protect, requireRole('auditor'), AuditorController.getProfile);
router.put('/profile', protect, requireRole('auditor'), AuditorController.updateProfile);

module.exports = router;
