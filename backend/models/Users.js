// backend/models/Users.js
const mongoose = require('mongoose');

// Align schema with controller expectations (username + password)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: null },
  // OTP fields for forgot-password flow
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
