// backend/controllers/ReportController.js
const Report = require('../models/report');
const Unit = require('../models/unit');
const User = require('../models/Users');

// Get all reports (for admin/auditor)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('unit')
      .populate('technician', 'username email');
    res.json(reports);
  } catch (err) {
    console.error('getAllReports error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single report
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('unit')
      .populate('technician', 'username email');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    console.error('getReportById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update report status (admin/auditor can mark as resolved/pending)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'pending', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('unit technician');

    if (!updated) return res.status(404).json({ message: 'Report not found' });

    res.json(updated);
  } catch (err) {
    console.error('updateReportStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a report (admin only)
exports.deleteReport = async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('deleteReport error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
