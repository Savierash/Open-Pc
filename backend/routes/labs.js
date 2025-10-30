// backend/routes/labs.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lab = require('../models/lab');
const Unit = require('../models/unit'); 
const unitsRouter = require('./units');


// GET /api/labs  -> list labs
router.get('/', async (req, res) => {
  try {
    const labs = await Lab.find({}).sort({ name: 1 });
    return res.json(labs);
  } catch (err) {
    console.error('Failed to fetch labs', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/labs -> create lab
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'name required' });

  try {
    const existing = await Lab.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Lab already exists' });

    const lab = new Lab({ name });
    const saved = await lab.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Failed to create lab', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/labs/:id -> delete lab and optionally its units (or keep)
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid lab id' });

  try {
    const removed = await Lab.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Lab not found' });
    // Optional: remove units belonging to lab
    await Unit.deleteMany({ lab: id }).catch(e => console.warn('Failed to delete units for lab', id, e));
    return res.json({ message: 'Lab deleted', id: removed._id });
  } catch (err) {
    console.error('Failed to delete lab', id, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// OPTIONAL: nested route GET /api/labs/:labId/units (handy if you prefer not to use server internal forward)
router.get('/:labId/units', async (req, res) => {
  const labId = req.params.labId;
  if (!mongoose.Types.ObjectId.isValid(labId)) return res.status(400).json({ message: 'Invalid labId' });

  try {
    const units = await Unit.find({ lab: labId }).sort({ name: 1 });
    return res.json(units);
  } catch (err) {
    console.error('Failed to fetch units for lab (nested)', labId, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
