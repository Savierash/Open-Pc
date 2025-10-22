// backend/routes/units.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Unit = require('../models/unit');
const Lab = require('../models/lab');

// GET /api/units?labId=...
router.get('/', async (req, res) => {
  try {
    const { labId } = req.query;
    const filter = labId && mongoose.Types.ObjectId.isValid(labId) ? { lab: labId } : {};
    const units = await Unit.find(filter).sort({ createdAt: 1 }).populate('lab', 'name');
    res.json(units);
  } catch (err) {
    console.error('GET /api/units error', err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/units
router.post('/', async (req, res) => {
  try {
    const { name, lab, status, notes } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name required' });
    if (!lab || !mongoose.Types.ObjectId.isValid(lab)) return res.status(400).json({ message: 'Valid lab id required' });

    const labDoc = await Lab.findById(lab);
    if (!labDoc) return res.status(404).json({ message: 'Lab not found' });

    const exists = await Unit.findOne({ lab, name: { $regex: `^${name.trim()}$`, $options: 'i' }});
    if (exists) return res.status(409).json({ message: 'Unit with that name already exists in this lab' });

    const unit = new Unit({ name: name.trim(), lab, status: status || 'functional', notes: notes || '' });
    await unit.save();
    res.status(201).json(unit);
  } catch (err) {
    console.error('POST /api/units error', err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/units/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const update = {};
    ['name','status','notes','lab'].forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    if (update.lab && !mongoose.Types.ObjectId.isValid(update.lab)) return res.status(400).json({ message: 'Invalid lab id' });
    const updated = await Unit.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Unit not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/units/:id error', err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/units/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await Unit.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Deleted', id: deleted._id });
  } catch (err) {
    console.error('DELETE /api/units/:id error', err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
