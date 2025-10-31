// backend/models/report.js
const mongoose = require('mongoose');

const issuesSchema = new mongoose.Schema({
  ramIssue: { type: Boolean, default: false },
  osIssue: { type: Boolean, default: false },
  cpuIssue: { type: Boolean, default: false },
  noInternet: { type: Boolean, default: false },
  storageIssue: { type: Boolean, default: false },
  virus: { type: Boolean, default: false }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  technicianId: { type: String, default: '' },
  dateIssued: { type: String, default: '' },
  lastIssued: { type: String, default: '' },
  status: { type: String, default: 'Functional' },
  issues: { type: issuesSchema, default: () => ({}) },
  otherIssues: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
