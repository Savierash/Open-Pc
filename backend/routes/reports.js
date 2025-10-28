const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', protect, ReportController.list);
router.get('/:id', protect, ReportController.get);
router.post('/', protect, ReportController.create);
// update reports: allow technicians and admins
router.put('/:id', protect, requireRole('technician', 'admin'), ReportController.update);
// deletes reserved for admins
router.delete('/:id', protect, requireRole('admin'), ReportController.remove);

module.exports = router;
