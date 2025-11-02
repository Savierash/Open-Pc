// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ReportController = require('../controllers/ReportController');

// ✅ Technician routes first (so they are not overridden)
router.get('/technician/lab/:labId', protect, requireRole('technician'), ReportController.getReportsByLab); // ✅ added
router.get('/technician/unit/:unitId', protect, requireRole('technician'), ReportController.getReportsByUnit); // ✅ added

// Admin & Auditor endpoints
router.get('/', protect, requireRole('admin'), ReportController.getAllReports);
router.get('/auditor', protect, requireRole('auditor'), ReportController.getAllReports);
router.get('/:id', protect, requireRole('admin'), ReportController.getReportById);
router.put('/:id/status', protect, requireRole('admin'), ReportController.updateReportStatus);
router.delete('/:id', protect, requireRole('admin'), ReportController.deleteReport);

module.exports = router;
