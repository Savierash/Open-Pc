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
  try {
    const { name, lab, status, os, ram, storage, cpu, lastIssued, notes } = req.body;
    if (!name || !lab) return res.status(400).json({ message: 'name and lab required' });
    if (!mongoose.Types.ObjectId.isValid(lab)) return res.status(400).json({ message: 'Invalid lab id' });
    const exists = await Unit.findOne({ name: name.trim(), lab });
    if (exists) return res.status(409).json({ message: 'Unit already exists in this lab' });
    const unit = await Unit.create({ name: name.trim(), lab, status, os, ram, storage, cpu, lastIssued, notes });
    res.status(201).json(unit);
  } catch (err) {
    console.error('POST /api/units', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/units/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updates = req.body;
    const updated = await Unit.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Unit not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/units/:id', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/units/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const removed = await Unit.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Deleted', id: removed._id });
  } catch (err) {
    console.error('DELETE /api/units/:id', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
