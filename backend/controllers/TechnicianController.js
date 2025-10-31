// backend/controllers/TechnicianController.js
const Unit = require('../models/unit');
const Lab = require('../models/lab');
const Report = require('../models/report');
const User = require('../models/Users');

// ✅ Dashboard Summary
exports.getDashboard = async (req, res) => {
  try {
    // 🆕 Technician-specific filter (only show units assigned to the logged-in technician)
    const techId = req.user?.id || req.user?._id;
    const filter = techId ? { assignedTo: techId } : {};

    // 🧮 Normalize status queries (🆕 Added case-insensitive filters for consistency)
    const totalUnits = await Unit.countDocuments(filter);
    const counts = {
      functional: await Unit.countDocuments({ ...filter, status: { $regex: /^functional$/i } }), // 🆕
      maintenance: await Unit.countDocuments({ ...filter, status: { $regex: /^maintenance$/i } }), // 🆕
      outOfOrder: await Unit.countDocuments({ ...filter, status: { $regex: /^out of order$/i } }), // 🆕
    };

    // 🧾 Percentage of functional units
    const percentFunctional = totalUnits
      ? Math.round((counts.functional / totalUnits) * 100)
      : 0;

    // 🧩 Per Lab Summary (🆕 Improved aggregation to count statuses case-insensitively)
    const perLab = await Lab.aggregate([
      {
        $lookup: {
          from: 'units',
          localField: '_id',
          foreignField: 'lab',
          as: 'units',
        },
      },
      {
        $project: {
          name: 1,
          totalUnits: { $size: '$units' },
          functional: {
            $size: {
              $filter: {
                input: '$units',
                as: 'u',
                cond: { $regexMatch: { input: '$$u.status', regex: /^functional$/i } }, // 🆕
              },
            },
          },
          maintenance: {
            $size: {
              $filter: {
                input: '$units',
                as: 'u',
                cond: { $regexMatch: { input: '$$u.status', regex: /^maintenance$/i } }, // 🆕
              },
            },
          },
          outOfOrder: {
            $size: {
              $filter: {
                input: '$units',
                as: 'u',
                cond: { $regexMatch: { input: '$$u.status', regex: /^out of order$/i } }, // 🆕
              },
            },
          },
        },
      },
    ]);

    // 🆕 Generate Trend Data (for "System Status" section in Dashboard)
    // This creates sample data showing how many PCs were functional per day over the past week.
    const today = new Date();
    const trend = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Simulated slight variation to visualize the trend on frontend chart
      trend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., Mon, Tue
        value: Math.max(0, Math.min(100, percentFunctional - Math.floor(Math.random() * 10))), // 🆕
      });
    }

    // ✅ Recent Units (unchanged, just added populate for lab name)
    const recentUnits = await Unit.find(filter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('lab', 'name'); // 🆕 Added populate to include lab name

    // ✅ Send all enhanced data to frontend
    res.json({
      totalUnits,
      counts,
      percentFunctional,
      perLab,
      recentUnits,
      trend, // 🆕 Added trend for chart
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};

// ✅ Units List
exports.getUnits = async (req, res) => {
  try {
    const labId = req.query.labId;
    const techId = req.user?.id || req.user?._id;
    const filter = labId ? { lab: labId } : {};
    if (techId) filter.assignedTo = techId; // 🆕 optional filtering by assigned technician

    const units = await Unit.find(filter).populate('lab', 'name').sort({ name: 1 });
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load units', error: err.message });
  }
};

// ✅ Update Unit Status / Details
exports.updateUnit = async (req, res) => {
  try {
    const updated = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Unit not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update unit', error: err.message });
  }
};

// ✅ Reports
exports.getReports = async (req, res) => {
  try {
    const techId = req.user?.id || req.user?._id;
    const reports = await Report.find({ technician: techId })
      .populate('unit', 'name status')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load reports', error: err.message });
  }
};

// 🆕 Create Report (uses issues + otherIssues fields from schema)
exports.createReport = async (req, res) => {
  try {
    const techId = req.user?.id || req.user?._id;
    const { unitId, issues, otherIssues, status } = req.body;

    if (!unitId) {
      return res.status(400).json({ message: 'Unit ID is required' });
    }

    const newReport = new Report({
      technician: techId,
      unit: unitId,
      issues: issues || {},
      otherIssues: otherIssues || '',
      status: status || 'open',
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    console.error('createReport error:', err);
    res.status(500).json({ message: 'Failed to create report', error: err.message });
  }
};

// 🆕 Update Report Status
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Report not found' });
    res.json(updated);
  } catch (err) {
    console.error('updateReportStatus error:', err);
    res.status(500).json({ message: 'Failed to update report status', error: err.message });
  }
};

// ✅ Technician Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role?.name || "Technician",
    });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete profile', error: err.message });
  }
};
