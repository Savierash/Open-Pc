// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

exports.protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Populate role name when fetching user
    req.user = await User.findById(decoded.id)
      .select('-password')
      .populate('role', 'name'); // <--- Added this

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
  }
};
