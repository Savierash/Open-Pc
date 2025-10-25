// backend/models/users.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },

  // added for OTP functionality
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
