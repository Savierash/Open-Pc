// backend/models/role.js
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'auditor', 'tech'
  name: { type: String, required: true },              // human name e.g. 'Auditor'
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Role', RoleSchema);
