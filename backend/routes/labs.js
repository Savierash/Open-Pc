// backend/routes/labs.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Lab = require('../models/lab');
const Unit = require('../models/unit');

// GET /api/labs  (list labs, include unitCount)
router.get('/', async (req, res) => {
  try {
    // aggregation to include unitCount per lab
    const labs = await Lab.aggregate([
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: 'units',           // collection name
          localField: '_id',
          foreignField: 'lab',     // Unit.lab references Lab._id
          as: 'units'
        }
      },
      {
        $addFields: {
          unitCount: { $size: '$units' }
        }
      },
      {
        $project: {
          units: 0 // remove units array from result
        }
      }
    ]);

    return res.json(labs);
  } catch (err) {
    console.error('GET /labs error', err);
    return res.status(500).json({ message: 'Failed to fetch labs' });
  }
});

// GET /api/labs/with-functional-count
router.get('/with-functional-count', async (req, res) => {
  try {
    const agg = await Unit.aggregate([
      { $group: {
          _id: '$lab',
          total: { $sum: 1 },
          functionalCount: { $sum: { $cond: [{ $eq: ['$status', 'Functional'] }, 1, 0] } }
      }},
      { $lookup: { from: 'labs', localField: '_id', foreignField: '_id', as: 'lab' } },
      { $unwind: '$lab' },
      { $project: {
          _id: '$lab._id',
          name: '$lab.name',
          unitCount: '$total',
          functionalCount: 1
      }}
    ]);

    const labs = await Lab.find().lean();
    const map = {};
    agg.forEach(a => (map[a._id.toString()] = a));

    const merged = labs.map(l => map[l._id.toString()] || {
      _id: l._id,
      name: l.name,
      unitCount: 0,
      functionalCount: 0
    });

    res.json(merged);
  } catch (err) {
    console.error('GET /with-functional-count error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/labs/with-maintenance-count
// Returns an array of labs with fields: _id, name, unitCount, maintenanceCount
router.get('/with-maintenance-count', async (req, res) => {
  try {
    // Aggregate units grouped by lab to get totals & maintenance counts
    const agg = await Unit.aggregate([
      {
        $group: {
          _id: '$lab',
          total: { $sum: 1 },
          maintenanceCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Maintenance'] }, 1, 0]
            }
          }
        }
      },
      // join to labs collection to get lab names
      {
        $lookup: {
          from: 'labs',
          localField: '_id',
          foreignField: '_id',
          as: 'lab'
        }
      },
      { $unwind: { path: '$lab', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: '$lab._id',
          name: '$lab.name',
          unitCount: '$total',
          maintenanceCount: 1
        }
      }
    ]);

    // Fetch all labs and merge results so labs with zero units are included
    const labsAll = await Lab.find().lean();
    const mapById = {};
    agg.forEach(a => {
      // ensure key is string
      mapById[a._id.toString()] = {
        _id: a._id,
        name: a.name,
        unitCount: a.unitCount || 0,
        maintenanceCount: a.maintenanceCount || 0
      };
    });

    const merged = labsAll.map(l => {
      const id = l._1?._id ? l._1._id : l._id; // defensive (but normally l._id)
      // use string form
      const key = (l._id || '').toString();
      if (mapById[key]) return mapById[key];
      return { _id: l._id, name: l.name, unitCount: 0, maintenanceCount: 0 };
    });

    return res.json(merged);
  } catch (err) {
    console.error('GET /with-maintenance-count error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/labs/:id -> single lab with unitCount
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid lab id' });
  }

  try {
    const lab = await Lab.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'units',
          localField: '_id',
          foreignField: 'lab',
          as: 'units'
        }
      },
      {
        $addFields: {
          unitCount: { $size: '$units' }
        }
      },
      {
        $project: {
          units: 0
        }
      }
    ]);

    if (!lab || lab.length === 0) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    return res.json(lab[0]);
  } catch (err) {
    console.error(`GET /labs/${id} error`, err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/labs -> create lab
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'name required' });
  }

  try {
    const existing = await Lab.findOne({ name: name.trim() });
    if (existing) return res.status(409).json({ message: 'Lab already exists' });

    const lab = new Lab({ name: name.trim() });
    const saved = await lab.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Failed to create lab', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/labs/:id -> delete lab and its units
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid lab id' });

  try {
    const removed = await Lab.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Lab not found' });
    // remove units belonging to lab (best-effort)
    await Unit.deleteMany({ lab: id }).catch(e => console.warn('Failed to delete units for lab', id, e));
    return res.json({ message: 'Lab deleted', id: removed._id });
  } catch (err) {
    console.error('Failed to delete lab', id, err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/labs/:labId/units - list units for a lab
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
