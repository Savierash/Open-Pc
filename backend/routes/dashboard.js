// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let Unit, Lab;
try {
  Unit = require('../models/unit');
  Lab = require('../models/lab');
} catch (e) {
  console.error('Failed to require models in dashboard route:', e);
  router.get('/', (req, res) => {
    res.status(500).json({ message: 'Server misconfigured - models not loaded', detail: String(e) });
  });
  module.exports = router;
  return;
}

/**
 * GET /api/dashboard
 * Returns:
 * {
 *   totalUnits: Number,
 *   counts: { functional, maintenance, outOfOrder },
 *   percentFunctional: Number,
 *   perLab: [{ labId, name, total, functional, maintenance, outOfOrder }],
 *   recentUnits: [{ name, status, lab, updatedAt }],
 *   trend: [{ date, value }]
 * }
 */
router.get('/', async (req, res) => {
  try {
    // --- 1. TOTALS ---
    const totalUnits = await Unit.countDocuments();
    const [functional, maintenance, outOfOrder] = await Promise.all([
      Unit.countDocuments({ status: { $in: ['Functional', 'functional'] } }),
      Unit.countDocuments({ status: { $in: ['Maintenance', 'maintenance'] } }),
      Unit.countDocuments({ status: { $in: ['OutOfOrder', 'Out-of-Order', 'Out of Order', 'outoforder'] } }),
    ]);

    const percentFunctional = totalUnits > 0 ? Math.round((functional / totalUnits) * 100) : 0;

    // --- 2. PER-LAB AGGREGATION ---
    const perLabAgg = await Unit.aggregate([
      {
        $group: {
          _id: '$lab',
          total: { $sum: 1 },
          functional: { $sum: { $cond: [{ $in: ['$status', ['Functional', 'functional']] }, 1, 0] } },
          maintenance: { $sum: { $cond: [{ $in: ['$status', ['Maintenance', 'maintenance']] }, 1, 0] } },
          outOfOrder: {
            $sum: {
              $cond: [
                { $in: ['$status', ['OutOfOrder', 'Out-of-Order', 'Out of Order', 'outoforder']] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { total: -1 } },
      {
        $lookup: {
          from: 'labs',
          localField: '_id',
          foreignField: '_id',
          as: 'lab',
        },
      },
      { $unwind: { path: '$lab', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          labId: '$_id',
          name: '$lab.name',
          total: 1,
          functional: 1,
          maintenance: 1,
          outOfOrder: 1,
        },
      },
    ]);

    // --- 3. RECENT UNITS ---
    const recentUnits = await Unit.find()
      .sort({ updatedAt: -1 })
      .limit(8)
      .populate('lab', 'name')
      .select('name status lab updatedAt')
      .lean();

    // --- 4. TREND MOCK (7-day visualization) ---
    const trend = (() => {
      const days = 7;
      const now = new Date();
      const labels = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        labels.push(d.toLocaleString(undefined, { month: 'short', day: 'numeric' }));
      }

      const base = Math.max(5, Math.min(90, percentFunctional - 12));
      const step = Math.round((percentFunctional - base) / Math.max(1, labels.length - 1));
      return labels.map((lbl, idx) => ({
        date: lbl,
        value: Math.max(0, Math.min(100, base + step * idx)),
      }));
    })();

    // --- 5. RETURN DASHBOARD DATA ---
    res.json({
      totalUnits,
      counts: { functional, maintenance, outOfOrder },
      percentFunctional,
      perLab: perLabAgg,
      recentUnits,
      trend,
    });
  } catch (err) {
    console.error('GET /api/dashboard error:', err);
    res.status(500).json({
      message: 'Server error',
      detail: err.message || String(err),
    });
  }
});

module.exports = router;
