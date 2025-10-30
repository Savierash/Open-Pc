// backend/routes/units.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Unit = require('../models/unit');
const Lab = require('../models/lab');


// GET /api/units?labId=<id>
router.get('/', async (req, res) => {
  const labId = req.query.labId || req.query.lab;
  if (!labId) {
    return res.status(400).json({ message: 'labId query parameter required' });
  }
  if (!mongoose.Types.ObjectId.isValid(labId)) {
    return res.status(400).json({ message: 'Invalid labId' });
  }
  try {
    const units = await Unit.find({ lab: labId }).sort({ name: 1 });
    return res.json(units);
  } catch (err) {
    console.error('Failed to fetch units for lab', labId, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/units
router.post('/', async (req, res) => {
  const { name, lab, status = 'Functional', os = '', ram = '', storage = '', cpu = '', lastIssued = '' } = req.body;
  if (!name || !lab) return res.status(400).json({ message: 'name and lab required' });
  if (!mongoose.Types.ObjectId.isValid(lab)) return res.status(400).json({ message: 'Invalid lab id' });

  try {
    const unit = new Unit({ name, lab, status, os, ram, storage, cpu, lastIssued });
    const saved = await unit.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Failed to create unit', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/units/:id
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid unit id' });

  try {
    const updated = await Unit.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Unit not found' });
    return res.json(updated);
  } catch (err) {
    console.error('Failed to update unit', id, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/units/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid unit id' });

  try {
    const removed = await Unit.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Unit not found' });
    return res.json({ message: 'Unit deleted', id: removed._id });
  } catch (err) {
    console.error('Failed to delete unit', id, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
