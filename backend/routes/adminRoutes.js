// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const User = require('../models/Users'); // change to '../models/Users' if your file is named Users.js
const RequestModel = require('../models/Request');

const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

/**
 * adminGuard wraps handlers with protect + requireRole('admin') if those middlewares exist.
 * If your project expects explicit use of middleware on each route, you can replace adminGuard usage
 * with router.get('/path', protect, requireRole('admin'), handler).
 */
function adminGuard(handler) {
  return async (req, res, next) => {
    try {
      if (typeof protect === 'function' && typeof requireRole === 'function') {
        return protect(req, res, (err) => {
          if (err) return next(err);
          return requireRole('admin')(req, res, (err2) => {
            if (err2) return next(err2);
            return handler(req, res, next);
          });
        });
      } else {
        return handler(req, res, next);
      }
    } catch (err) {
      return next(err);
    }
  };
}

/**
 * GET /api/_debug/requests
 * Unprotected convenience endpoint that returns up to 10 requests (or mock if none).
 * Useful while building frontend.
 */
router.get('/_debug/requests', async (req, res) => {
  try {
    const docs = await RequestModel.find().limit(10).lean();
    if (!docs || docs.length === 0) {
      return res.json([
        {
          _id: 'mock-1',
          title: 'Printer jam (mock)',
          description: 'Printer in Lab A is jammed.',
          type: 'tech',
          status: 'pending',
          requester: { name: 'Alice', email: 'alice@example.com' },
          attachments: []
        }
      ]);
    }
    return res.json(docs);
  } catch (err) {
    console.error('GET /_debug/requests failed', err);
    return res.status(500).json({ message: 'debug fetch failed', error: err.message });
  }
});

/**
 * GET /api/admin/technicians
 * Admin-only: returns list of users whose role indicates "technician".
 */
router.get('/admin/technicians', protect, requireRole('admin'), async (req, res) => {
  try {
    // Try to match different possible role fields
    const techs = await User.find({
      $or: [
        { role: { $regex: /tech/i } },
        { roleKey: { $regex: /tech/i } },
        { 'roles.name': { $regex: /tech/i } },
        { 'roles.key': { $regex: /tech/i } }
      ]
    }).select('username firstName lastName email contactNumber phoneNumber address avatar');

    const normalized = techs.map(u => ({
      _id: u._id,
      username: u.username || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      email: u.email,
      phone: u.contactNumber || u.phoneNumber || '',
      address: u.address || '',
      avatar: u.avatar || ''
    }));

    return res.json(normalized);
  } catch (err) {
    console.error('GET /admin/technicians failed', err);
    return res.status(500).json({ message: 'Failed to fetch technicians', error: err.message });
  }
});

/**
 * GET /api/tech-requests
 * Admin-protected: returns requests categorized as tech/repair/equipment.
 */
router.get('/tech-requests', adminGuard(async (req, res) => {
  try {
    const docs = await RequestModel.find({
      $or: [
        { type: { $regex: /tech|repair|equipment|technician/i } },
        { requestType: { $regex: /tech|repair|equipment|technician/i } },
        { category: { $regex: /tech|repair|equipment|technician/i } },
      ]
    })
    .populate('requester', 'username email')
    .sort({ createdAt: -1 })
    .lean();

    return res.json(docs);
  } catch (err) {
    console.error('GET /tech-requests failed', err);
    return res.status(500).json({ message: 'Failed to fetch tech requests', error: err.message });
  }
}));

/**
 * GET /api/requests
 * Admin-protected: returns all requests (useful for filtering client-side).
 */
router.get('/requests', adminGuard(async (req, res) => {
  try {
    const docs = await RequestModel.find().populate('requester', 'username email').sort({ createdAt: -1 }).lean();
    return res.json(docs);
  } catch (err) {
    console.error('GET /requests failed', err);
    return res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
}));

/**
 * PATCH /api/requests/:id
 * Admin-protected: allow updating fields (we accept `status` for now).
 */
router.patch('/requests/:id', adminGuard(async (req, res) => {
  try {
    const updates = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: 'No allowed update fields provided' });

    const updated = await RequestModel.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Request not found' });
    return res.json({ message: 'Request updated', request: updated });
  } catch (err) {
    console.error('PATCH /requests/:id failed', err);
    return res.status(500).json({ message: 'Failed to update request', error: err.message });
  }
}));

/**
 * POST /api/requests/:id/accept
 * POST /api/requests/:id/decline
 * Admin-protected convenience endpoints.
 */
router.post('/requests/:id/accept', adminGuard(async (req, res) => {
  try {
    const updated = await RequestModel.findByIdAndUpdate(req.params.id, { $set: { status: 'accepted' } }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Request not found' });
    return res.json({ message: 'Accepted', request: updated });
  } catch (err) {
    console.error('POST /requests/:id/accept failed', err);
    return res.status(500).json({ message: 'Failed to accept request', error: err.message });
  }
}));

router.post('/requests/:id/decline', adminGuard(async (req, res) => {
  try {
    const updated = await RequestModel.findByIdAndUpdate(req.params.id, { $set: { status: 'declined' } }, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: 'Request not found' });
    return res.json({ message: 'Declined', request: updated });
  } catch (err) {
    console.error('POST /requests/:id/decline failed', err);
    return res.status(500).json({ message: 'Failed to decline request', error: err.message });
  }
}));

module.exports = router;
