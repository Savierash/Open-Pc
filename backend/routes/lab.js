// routes/labs.js
const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');

// GET /api/labs  -> list all labs
router.get('/', async (req, res) => {
  try {
    const labs = await Lab.find().sort({ createdAt: 1 });
    res.json(labs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/labs -> create new lab { name }
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name required' });
    }

    // Case-insensitive uniqueness check
    const exists = await Lab.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (exists) return res.status(400).json({ message: 'Lab already exists' });

    const lab = new Lab({ name: name.trim() });
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    console.error(err);
    // Duplicate key error fallback
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Lab already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/labs/:id -> delete by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await Lab.findByIdAndDelete(id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });
    res.json({ message: 'Deleted', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
