// backend/controllers/userController.js
const User = require('../models/Users');
const path = require('path');

// ✅ Get logged-in user details
exports.getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch user data" });
  }
};

// ✅ Update user: only allow address/contactNumber to be changed
exports.updateUser = async (req, res) => {
  try {
    const allowed = {};
    if (req.body.address !== undefined) allowed.address = req.body.address;
    if (req.body.contactNumber !== undefined) allowed.contactNumber = req.body.contactNumber;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: allowed },
      { new: true }
    ).select('-password').populate('role', 'name');

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update user", error });
  }
};

// ✅ Upload Avatar/Profile Image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Match this with your multer upload folder path
    const imageUrl = `/uploads/profilePictures/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: imageUrl },
      { new: true }
    ).select('-password').populate('role', 'name');

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
      updatedUser
    });
  } catch (error) {
    return res.status(500).json({ message: "Image upload failed", error });
  }
};
