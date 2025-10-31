// backend/routes/technician.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const TechnicianController = require('../controllers/TechnicianController');

// Dashboard summary
router.get('/dashboard', protect, requireRole('technician'), TechnicianController.getDashboard);

// Units list & update
router.get('/units', protect, requireRole('technician'), TechnicianController.getUnits);
router.put('/units/:id', protect, requireRole('technician'), TechnicianController.updateUnit);

// Reports
router.get('/reports', protect, requireRole('technician'), TechnicianController.getReports);
router.post('/reports', protect, requireRole('technician'), TechnicianController.createReport);

// Profile
router.get('/profile', protect, requireRole('technician'), TechnicianController.getProfile);
router.put('/profile', protect, requireRole('technician'), TechnicianController.updateProfile);
router.delete('/delete', protect, requireRole('technician'), TechnicianController.deleteProfile);

module.exports = router;
