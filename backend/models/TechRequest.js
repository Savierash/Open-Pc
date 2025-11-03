const mongoose = require('mongoose');

const techRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  techId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  contactNo: { type: String },
  address: { type: String },
  documents: [{ type: String }],
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('TechRequest', techRequestSchema);
