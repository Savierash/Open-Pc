// backend/models/lab.js
const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('lab', LabSchema);
