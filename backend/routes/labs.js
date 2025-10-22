// backend/routes/labs.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lab = require('../models/lab');

// GET /api/labs
router.get('/', async (req, res) => {
  try {
    const labs = await Lab.find().sort({ createdAt: 1 });
    res.json(labs);
  } catch (err) {
    console.error('GET /api/labs error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/labs
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name required' });

    const exists = await Lab.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' }});
    if (exists) return res.status(409).json({ message: 'Lab exists' });

    const lab = new Lab({ name: name.trim() });
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    console.error('POST /api/labs error', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Lab exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/labs/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name required' });

    const duplicate = await Lab.findOne({ _id: { $ne: id }, name: { $regex: `^${name.trim()}$`, $options: 'i' }});
    if (duplicate) return res.status(409).json({ message: 'Another lab already has that name' });

    const updated = await Lab.findByIdAndUpdate(id, { name: name.trim() }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Lab not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/labs/:id error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/labs/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await Lab.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Lab not found' });
    res.json({ message: 'Deleted', id: deleted._id });
  } catch (err) {
    console.error('DELETE /api/labs/:id error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
