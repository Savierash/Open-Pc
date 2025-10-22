// backend/models/unit.js
const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  status: { type: String, enum: ['functional','maintenance','out-of-order'], default: 'functional' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Unit', UnitSchema);
