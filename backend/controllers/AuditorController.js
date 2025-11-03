// backend/controllers/AuditorController.js
const Unit = require('../models/unit');
const Lab = require('../models/lab');
const Report = require('../models/report');
const User = require('../models/Users');
const UnitService = require('../services/UnitService');
const fs = require('fs');
const path = require('path');

// ✅ Dashboard - same as technician but shows ALL labs/units
exports.getDashboard = async (req, res) => {
  try {
    const counts = await UnitService.getUnitCounts();
    const perLab = await UnitService.getPerLabSummary();

    const totalUnits = counts.totalUnits;
    const percentFunctional = totalUnits
      ? Math.round((counts.functional / totalUnits) * 100)
      : 0;

    const recentUnits = await Unit.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('lab', 'name');

    res.json({
      totalUnits,
      counts,
      percentFunctional,
      perLab,
      recentUnits
    });
  } catch (err) {
    console.error('Auditor dashboard error:', err);
    res.status(500).json({ message: 'Failed to load auditor dashboard', error: err.message });
  }
};

// ✅ Inventory: view & edit units
exports.getUnits = async (req, res) => {
  try {
    const labId = req.query.labId;
    const filter = labId ? { lab: labId } : {};
    const units = await Unit.find(filter).populate('lab', 'name');
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load units', error: err.message });
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const updated = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Unit not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update unit', error: err.message });
  }
};

// ✅ Unit status view (filter by lab/status)
exports.getUnitStatus = async (req, res) => {
  try {
    const { status, labId } = req.query;
    const filter = {};
    if (status) filter.status = { $regex: new RegExp(`^${status}$`, 'i') };
    if (labId) filter.lab = labId;

    const units = await Unit.find(filter).populate('lab', 'name');
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unit status', error: err.message });
  }
};

// ✅ Reports: create and view reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('unit', 'name lab status')
      .populate('technician', 'username email');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

exports.createReport = async (req, res) => {
  try {
    const { unitId, issues, otherIssues } = req.body;
    if (!unitId) return res.status(400).json({ message: 'Unit ID is required' });

    const newReport = new Report({
      unit: unitId,
      technician: req.user._id,
      issues,
      otherIssues,
      status: 'open',
    });
    await newReport.save();

    res.status(201).json({ message: 'Report submitted successfully', report: newReport });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create report', error: err.message });
  }
};

// ✅ Technicians directory
exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find().populate('role', 'name');
    const filtered = technicians.filter(u => u.role?.name?.toLowerCase() === 'technician');
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch technicians', error: err.message });
  }
};

// ✅ Profile info
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = `/uploads/profilePics/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imagePath },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile image uploaded successfully', user });
  } catch (err) {
    console.error('Auditor uploadProfileImage error:', err);
    res.status(500).json({ message: 'Failed to upload image', error: err.message });
  }
};
