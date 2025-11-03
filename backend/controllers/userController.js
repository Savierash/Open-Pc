// backend/controllers/UserController.js

const User = require('../models/Users');
const fs = require('fs');
const path = require('path');

// ✅ GET /api/users?role=technician&q=search
exports.list = async (req, res) => {
  try {
    const { role, q } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    console.error('User list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /api/users/:id
exports.get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('User get by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get me error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ PUT /api/users/update
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Update user error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ POST /api/users/upload-profile-image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const imagePath = `/uploads/profilePics/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { profileImage: imagePath }, { new: true });

    res.json({ message: 'Image uploaded', user });
  } catch (err) {
    console.error('Upload profile image error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
