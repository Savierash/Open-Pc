// backend/models/unit.js
const mongoose = require('mongoose');

const issuesSchema = new mongoose.Schema({
  ramIssue: { type: Boolean, default: false },
  osIssue: { type: Boolean, default: false },
  cpuIssue: { type: Boolean, default: false },
  noInternet: { type: Boolean, default: false },
  storageIssue: { type: Boolean, default: false },
  virus: { type: Boolean, default: false }
}, { _id: false });

const unitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },        // e.g. ITS300-PC-002
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  os: { type: String, default: '' },
  ram: { type: String, default: '' },
  storage: { type: String, default: '' },
  cpu: { type: String, default: '' },
  lastIssued: { type: String, default: '' },                 // kept as string for compatibility with UI
  status: { type: String, enum: ['Functional','Maintenance','Out Of Order'], default: 'Functional' },
  technicianId: { type: String, default: '' },               // optional
  otherNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);
