// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username must be less than 30 characters'],
    },
    // store hashed password here
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Virtual field `password` to accept plain password and trigger hashing on save
userSchema.virtual('password')
  .set(function (plainPassword) {
    this._plainPassword = plainPassword;
  })
  .get(function () {
    return this._plainPassword;
  });

// Pre-save: if a plain password was provided, hash it into passwordHash
userSchema.pre('save', async function (next) {
  try {
    if (!this._plainPassword) return next();
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this._plainPassword, salt);
    // remove temp plain password
    this._plainPassword = undefined;
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
module.exports = User;
