// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const User = require('../models/Users');
const Unit = require('../models/unit');
const Lab = require('../models/lab');
const Report = require('../models/report');
const TechRequest = require('../models/TechRequest');
const sendEmail = require('../utils/sendEmail'); // ✅ optional (for notifications)

// ✅ Helper for admin-only protection
function adminGuard(handler) {
  return async (req, res, next) => {
    try {
      return protect(req, res, (err) => {
        if (err) return next(err);
        return requireRole('admin')(req, res, (err2) => {
          if (err2) return next(err2);
          return handler(req, res, next);
        });
      });
    } catch (err) {
      return next(err);
    }
  };
}

/* ============================================================
   ✅ ADMIN DASHBOARD
=============================================================== */
router.get('/dashboard', adminGuard(async (req, res) => {
  try {
    const totalUnits = await Unit.countDocuments();
    const totalLabs = await Lab.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingTechs = await TechRequest.countDocuments({ status: 'pending' });

    res.json({
      totalUnits,
      totalLabs,
      totalReports,
      pendingTechRequests: pendingTechs,
    });
  } catch (err) {
    console.error('Dashboard fetch failed:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
}));

/* ============================================================
   ✅ TECHNICIANS LIST (Approved Only)
=============================================================== */
router.get('/admin/technicians', adminGuard(async (req, res) => {
  try {
    const techs = await User.find({
      isActive: true, // ✅ only active
      isVerified: true, // ✅ only verified
    })
      .populate('role', 'key name')
      .select('username firstName lastName email contactNumber techId role');

    // filter explicitly for technician role
    const filtered = techs.filter(
      (u) => u.role?.key?.toLowerCase() === 'technician'
    );

    const normalized = filtered.map((u) => ({
      _id: u._id,
      name: u.username || `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      contact: u.contactNumber || '',
      techId: u.techId || '',
    }));

    res.json(normalized);
  } catch (err) {
    console.error('Failed to fetch technicians:', err);
    res.status(500).json({ message: 'Failed to fetch technicians' });
  }
}));

/* ============================================================
   ✅ TECH REQUESTS LIST (Pending/Accepted/Rejected)
=============================================================== */
router.get('/tech-requests', adminGuard(async (req, res) => {
  try {
    const requests = await TechRequest.find().sort({ createdAt: -1 }).lean();
    res.json(requests);
  } catch (err) {
    console.error('Failed to fetch tech requests:', err);
    res.status(500).json({ message: 'Failed to fetch tech requests' });
  }
}));

/* ============================================================
   ✅ ACCEPT TECH REQUEST
=============================================================== */
router.patch('/tech-requests/:id/accept', adminGuard(async (req, res) => {
  try {
    const { id } = req.params;
    const request = await TechRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    const user = await User.findOne({ email: request.email });
    if (user) {
      user.isVerified = true;
      user.isActive = true; // ✅ make them visible + login enabled
      await user.save();

      // ✅ Optional: Send notification
      try {
        await sendEmail(
          user.email,
          'Technician Account Approved',
          `<h3>Your account has been approved!</h3><p>You may now log in to OpenPC.</p>`
        );
      } catch (err) {
        console.warn('Email notification failed:', err.message);
      }
    }

    res.json({ message: 'Technician accepted successfully', request });
  } catch (err) {
    console.error('Error accepting technician:', err);
    res.status(500).json({ message: 'Error accepting technician' });
  }
}));

/* ============================================================
   ✅ REJECT TECH REQUEST
=============================================================== */
router.patch('/tech-requests/:id/reject', adminGuard(async (req, res) => {
  try {
    const { id } = req.params;
    const request = await TechRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    const user = await User.findOne({ email: request.email });
    if (user) {
      user.isActive = false;
      user.isVerified = false;
      await user.save();
    }

    res.json({ message: 'Technician rejected successfully', request });
  } catch (err) {
    console.error('Error rejecting technician:', err);
    res.status(500).json({ message: 'Error rejecting technician' });
  }
}));

module.exports = router;
