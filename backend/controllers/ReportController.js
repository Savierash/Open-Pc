const Report = require('../models/report');

exports.list = async (req, res) => {
  try {
    const reports = await Report.find().populate('reporter', 'username email phoneNumber').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('reporter', 'username email phoneNumber');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, unit } = req.body;
    const reporter = req.user ? req.user.id : null;
    const newReport = new Report({ title, description, unit, reporter });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    // allow updates to title, description, status
    const { title, description, status } = req.body;
    if (title !== undefined) report.title = title;
    if (description !== undefined) report.description = description;
    if (status !== undefined) report.status = status;
    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    await report.remove();
    res.json({ message: 'Report removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
const Report = require('../models/report');

exports.list = async (req, res) => {
  try {
    const q = req.query || {};
    const reports = await Report.find(q).populate('reporter', 'username email').populate('unit', 'name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, reports });
  } catch (err) {
    console.error('List reports error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Report.findById(id).populate('reporter', 'username email').populate('unit', 'name');
    if (!r) return res.status(404).json({ message: 'Report not found' });
    res.json({ success: true, report: r });
  } catch (err) {
    console.error('Get report error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, unit } = req.body;
    const reporter = req.user && req.user.id;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const rep = new Report({ title, description, unit, reporter });
    await rep.save();
    res.status(201).json({ success: true, report: rep });
  } catch (err) {
    console.error('Create report error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Report.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Report not found' });
    res.json({ success: true, report: updated });
  } catch (err) {
    console.error('Update report error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Report.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    console.error('Delete report error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
