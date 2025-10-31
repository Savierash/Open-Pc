// backend/controllers/TechnicianController.js
const Unit = require('../models/unit');      // adjust path if filename differs
const Report = require('../models/report');
const User = require('../models/Users');

exports.getDashboard = async (req, res) => {
  try {
    const techId = req.user.id || req.user.userId || req.user._id;
    const units = await Unit.find({ assignedTo: techId }).populate('lab');
    const totalUnits = units.length;
    const counts = {
      functional: units.filter(u => u.status === 'functional').length,
      maintenance: units.filter(u => u.status === 'maintenance').length,
      outOfOrder: units.filter(u => u.status === 'out-of-order').length,
    };

    const recentUnits = units
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    const percentFunctional = totalUnits ? Math.round((counts.functional / totalUnits) * 100) : 0;

    res.json({
      totalUnits,
      counts,
      percentFunctional,
      perLab: [], // (optional) add later
      recentUnits,
      trend: [],  // (optional) add later
    });
  } catch (err) {
    console.error('getDashboard error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUnits = async (req, res) => {
  try {
    const techId = req.user.id || req.user.userId || req.user._id;
    const labId = req.query.labId; // optional filter
    const query = { assignedTo: techId };
    if (labId) query.lab = labId;
    const units = await Unit.find(query).populate('lab');
    res.json(units);
  } catch (err) {
    console.error('getUnits error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const unitId = req.params.id;
    const updates = req.body; // only accept permitted fields on front (status, notes, name etc)
    const updated = await Unit.findByIdAndUpdate(unitId, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Unit not found' });
    res.json(updated);
  } catch (err) {
    console.error('updateUnit error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reports
exports.getReports = async (req, res) => {
  try {
    const techId = req.user.id || req.user.userId || req.user._id;
    const reports = await Report.find({ technician: techId }).populate('unit');
    res.json(reports);
  } catch (err) {
    console.error('getReports error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createReport = async (req, res) => {
  try {
    const techId = req.user.id || req.user.userId || req.user._id;
    const { unit, issues, otherIssues } = req.body;
    if (!unit) return res.status(400).json({ message: 'Unit is required' });
    const report = await Report.create({ unit, technician: techId, issues: issues || {}, otherIssues: otherIssues || '' });
    res.status(201).json(report);
  } catch (err) {
    console.error('createReport error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const user = await User.findById(userId).select('-password').populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('getProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const updates = req.body;
    // don't allow password here — use a dedicated change-password route
    delete updates.password;
    const updated = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error('deleteProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
