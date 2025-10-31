// models/Lab.js
const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// virtual unitCount (calculated at query time using populate or aggregation)
LabSchema.virtual('unitCount', {
  ref: 'Unit',
  localField: '_id',
  foreignField: 'lab',
  count: true
});

module.exports = mongoose.model('Lab', LabSchema);
