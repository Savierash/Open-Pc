// backend/routes/units.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Unit = require('../models/unit');
const Lab = require('../models/lab');


  /**
 * GET /api/units
 * Optional query params:
 *  - labId : filter units by lab
 *  - limit : number of results
 *  - sort  : sorting e.g. "-updatedAt"
 *
 * Returns units (populated with lab).
 */
router.get('/', async (req, res) => {
  try {
    const { labId, limit = 0, sort = '-updatedAt' } = req.query;
    const q = {};
    if (labId && mongoose.Types.ObjectId.isValid(labId)) q.lab = labId;

    const query = Unit.find(q).populate('lab', 'name').sort(sort);
    if (Number(limit) > 0) query.limit(Number(limit));

    const units = await query.exec();
    res.json(units);
  } catch (err) {
    console.error('GET /units error', err);
    res.status(500).json({ message: 'Failed to fetch units' });
  }
});

/**
 * POST /api/units
 * body: { name, lab }
 */
router.post('/', async (req, res) => {
  try {
    const { name, lab, status, notes } = req.body;
    if (!name || !lab) return res.status(400).json({ message: 'name and lab required' });

    const unit = new Unit({ name: name.trim(), lab, status, notes });
    const saved = await unit.save();
    const populated = await saved.populate('lab', 'name').execPopulate();
    res.status(201).json(populated);
  } catch (err) {
    console.error('POST /units error', err);
    res.status(500).json({ message: 'Failed to create unit', error: err.message });
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

  /**
 * DELETE /api/units/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

    const removed = await Unit.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Unit deleted', id: removed._id });
  } catch (err) {
    console.error('DELETE /units/:id error', err);
    res.status(500).json({ message: 'Failed to delete unit' });
  }
});


module.exports = router;
