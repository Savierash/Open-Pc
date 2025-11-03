const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, default: '' },
  performedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['scheduled','in-progress','completed'], default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
