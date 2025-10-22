// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// defensive requires
let Unit, Lab;
try {
  Unit = require('../models/unit');
  Lab = require('../models/lab');
} catch (e) {
  console.error('Failed to require models in dashboard route:', e && e.stack ? e.stack : e);
  // still export a route that errors clearly
  router.get('/', (req, res) => {
    res.status(500).json({ message: 'Server misconfigured - models not loaded', detail: String(e) });
  });
  module.exports = router;
  return;
}

router.get('/', async (req, res) => {
  try {
    // totals
    const totalUnits = await Unit.countDocuments();
    const [functional, maintenance, outOfOrder] = await Promise.all([
      Unit.countDocuments({ status: 'functional' }),
      Unit.countDocuments({ status: 'maintenance' }),
      Unit.countDocuments({ status: 'out-of-order' })
    ]);

    const percentFunctional = totalUnits > 0 ? Math.round((functional / totalUnits) * 100) : 0;

    // per-lab aggregation (works even if lab missing)
    const perLabAgg = await Unit.aggregate([
      {
        $group: {
          _id: '$lab',
          total: { $sum: 1 },
          functional: { $sum: { $cond: [{ $eq: ['$status', 'functional'] }, 1, 0] } },
          maintenance: { $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] } },
          outOfOrder: { $sum: { $cond: [{ $eq: ['$status', 'out-of-order'] }, 1, 0] } }
        }
      },
      { $sort: { total: -1 } },
      {
        $lookup: {
          from: 'labs',
          localField: '_id',
          foreignField: '_id',
          as: 'lab'
        }
      },
      { $unwind: { path: '$lab', preserveNullAndEmptyArrays: true } },
      { $project: { labId: '$_id', name: '$lab.name', total: 1, functional: 1, maintenance: 1, outOfOrder: 1 } }
    ]);

    // recent units
    const recentUnits = await Unit.find()
      .sort({ updatedAt: -1 })
      .limit(8)
      .populate('lab', 'name')
      .select('name status lab updatedAt')
      .lean();

    // optional trend: build a simple 6-point mock if you don't store historicals
    const trend = (() => {
      const days = 6;
      const now = new Date();
      const labels = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        labels.push(d.toLocaleString(undefined, { month: 'short', day: 'numeric' }));
      }
      const base = Math.max(5, Math.min(90, percentFunctional - 12));
      const step = Math.round((percentFunctional - base) / Math.max(1, labels.length - 1));
      return labels.map((lbl, idx) => ({ date: lbl, value: Math.max(0, Math.min(100, base + step * idx)) }));
    })();

    res.json({
      totalUnits,
      counts: { functional, maintenance, outOfOrder },
      percentFunctional,
      perLab: perLabAgg,
      recentUnits,
      trend
    });
  } catch (err) {
    console.error('GET /api/dashboard error:', err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Server error', detail: String(err && err.message ? err.message : err) });
  }
});

module.exports = router;
