// backend/models/report.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issues: {
    ramIssue: { type: Boolean, default: false },
    osIssue: { type: Boolean, default: false },
    cpuIssue: { type: Boolean, default: false },
    noInternet: { type: Boolean, default: false },
    storageIssue: { type: Boolean, default: false },
    virus: { type: Boolean, default: false },
  },
  otherIssues: { type: String, default: '' },
  status: { type: String, enum: ['open','pending','resolved'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
