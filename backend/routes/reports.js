<<<<<<< HEAD
// backend/routes/reports.js
const express = require('express');
const mongoose = require('mongoose');
const Report = require('../models/report');
const Unit = require('../models/unit');
const Lab = require('../models/lab');

const router = express.Router();

/**
 * GET /api/reports
 * Optional query params:
 *   - labId
 *   - unitId
 */
router.get('/', async (req, res) => {
  const { labId, unitId } = req.query;
  const filter = {};
  if (labId) {
    if (!mongoose.Types.ObjectId.isValid(labId)) return res.status(400).json({ message: 'Invalid labId' });
    filter.lab = labId;
  }
  if (unitId) {
    if (!mongoose.Types.ObjectId.isValid(unitId)) return res.status(400).json({ message: 'Invalid unitId' });
    filter.unit = unitId;
  }
  try {
    const reports = await Report.find(filter)
      .populate('lab', 'name')
      .populate('unit', 'name status')
      .sort({ createdAt: -1 });
    return res.json(reports);
  } catch (err) {
    console.error('Failed to fetch reports', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/reports/:id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const r = await Report.findById(id).populate('lab', 'name').populate('unit', 'name status');
    if (!r) return res.status(404).json({ message: 'Report not found' });
    return res.json(r);
  } catch (err) {
    console.error('Failed to fetch report', id, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/reports
router.post('/', async (req, res) => {
  const { unit: unitId, lab: labId, technicianId, dateIssued, lastIssued, status = 'Functional', issues = {}, otherIssues = '' } = req.body;
  if (!unitId || !labId) return res.status(400).json({ message: 'unit and lab are required' });
  if (!mongoose.Types.ObjectId.isValid(unitId) || !mongoose.Types.ObjectId.isValid(labId)) {
    return res.status(400).json({ message: 'Invalid unit or lab id' });
  }
  try {
    // optional: validate unit belongs to lab
    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    if (String(unit.lab) !== String(labId)) {
      // not fatal, but warn
      console.warn('unit.lab mismatch', unitId, unit.lab, labId);
    }

    const report = new Report({ unit: unitId, lab: labId, technicianId, dateIssued, lastIssued, status, issues, otherIssues });
    const saved = await report.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Failed to create report', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/reports/:id
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const updated = await Report.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Report not found' });
    return res.json(updated);
  } catch (err) {
    console.error('Failed to update report', id, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/reports/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const removed = await Report.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Report not found' });
    return res.json({ message: 'Report deleted', id: removed._id });
  } catch (err) {
    console.error('Failed to delete report', id, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});
=======
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
>>>>>>> ed57e257b106bf09b2250133e25b52d6d62766a0

module.exports = router;
