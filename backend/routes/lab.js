// backend/routes/lab.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lab = require('../models/lab'); 

// GET /api/labs - list all lab
router.get('/', async (req, res) => {
  try {
    const lab = await Lab.find().sort({ createdAt: 1 });
    res.json(lab);
  } catch (err) {
    console.error('GET /api/lab error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/lab - create a new lab
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') return res.status(400).json({ message: 'Name required' });

    // Prevent case-insensitive duplicates
    const existing = await Lab.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (existing) return res.status(409).json({ message: 'Lab already exists' });

    const lab = new Lab({ name: name.trim() });
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    console.error('POST /api/lab error:', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Lab already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/lab/:id - update lab name (or other fields)
// Example body: { "name": "New Lab Name" }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const { name } = req.body;
    if (!name || name.trim() === '') return res.status(400).json({ message: 'Name required' });

    // Check if another lab (different id) already has this name (case-insensitive)
    const duplicate = await Lab.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name.trim()}$`, $options: 'i' }
    });
    if (duplicate) return res.status(409).json({ message: 'Another lab with that name already exists' });

    // Update and return new document
    const updated = await Lab.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Lab not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/lab/:id error:', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Lab name conflict' });
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/lab/:id - delete a lab
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const deleted = await Lab.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Lab not found' });
    res.json({ message: 'Deleted', id: deleted._id });
  } catch (err) {
    console.error('DELETE /api/lab/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
