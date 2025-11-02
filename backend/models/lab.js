// models/Lab.js
const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: '' },
}, { timestamps: true });

// virtual unitCount (calculated at query time using populate or aggregation)
LabSchema.virtual('unitCount', {
  ref: 'Unit',
  localField: '_id',
  foreignField: 'lab',
  count: true
});

module.exports = mongoose.model('Lab', LabSchema);
