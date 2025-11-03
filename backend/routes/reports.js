// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ReportController = require('../controllers/ReportController');

// ✅ Technician routes
router.get('/technician/lab/:labId', protect, requireRole('technician'), ReportController.getReportsByLab);
router.get('/technician/unit/:unitId', protect, requireRole('technician'), ReportController.getReportsByUnit);

// ✅ Common routes for Admin and Auditor
router.get('/', protect, requireRole('admin', 'auditor'), ReportController.getAllReports);
router.get('/:id', protect, requireRole('admin', 'auditor'), ReportController.getReportById);
router.put('/:id/status', protect, requireRole('admin', 'auditor'), ReportController.updateReportStatus);

// ✅ Admin-only route
router.delete('/:id', protect, requireRole('admin'), ReportController.deleteReport);

module.exports = router;
