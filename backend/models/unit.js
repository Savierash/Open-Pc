// backend/models/unit.js
const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  // keep enum values consistent with how you store them in the DB
  // e.g. 'functional' | 'maintenance' | 'out-of-order'
  status: {
    type: String,
    enum: ['functional', 'maintenance', 'out-of-order'],
    default: 'functional'
  },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Export using the same name as the schema variable
module.exports = mongoose.model('Unit', UnitSchema);
