// backend/models/unit.js
const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  os: { type: String, default: '' },
  ram: { type: String, default: '' },
  storage: { type: String, default: '' },
  cpu: { type: String, default: '' },
  lastIssued: { type: String, default: '' },
  status: { type: String, default: 'Functional' },
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);
