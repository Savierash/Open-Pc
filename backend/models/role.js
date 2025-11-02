// backend/models/role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'admin', 'technician'
  name: { type: String, required: true },              // e.g. 'Administrator'
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Role', RoleSchema);
