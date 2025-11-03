// backend/models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, // 'tech', 'facility', etc
  status: { type: String, default: 'pending' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachments: [String],
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
