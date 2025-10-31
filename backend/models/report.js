<<<<<<< HEAD
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
=======
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('report', reportSchema);
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  status: { type: String, enum: ['open','in-progress','resolved','closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
>>>>>>> ed57e257b106bf09b2250133e25b52d6d62766a0
