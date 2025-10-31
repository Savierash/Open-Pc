// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ReportController = require('../controllers/ReportController');

// Admin & Auditor endpoints
router.get('/', protect, requireRole('admin'), ReportController.getAllReports);
router.get('/auditor', protect, requireRole('auditor'), ReportController.getAllReports); // optional auditor access
router.get('/:id', protect, requireRole('admin'), ReportController.getReportById);
router.put('/:id/status', protect, requireRole('admin'), ReportController.updateReportStatus);
router.delete('/:id', protect, requireRole('admin'), ReportController.deleteReport);

module.exports = router;
