// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXPIRES_IN = '7d';

// Helper to normalize input
const normalize = (s = '') => (s && typeof s === 'string' ? s.trim() : '');

exports.register = async (req, res) => {
  try {
    let { email, username, password, confirmPassword } = req.body;
    email = normalize(email).toLowerCase();
    username = normalize(username);

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // check existing user by email OR username
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    // Create user using virtual 'password' so model hashes automatically
    const user = new User({ email, username });
    user.password = password; // virtual -> triggers hashing in pre('save')
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);

    // Duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    // If Mongoose validation error, return 400 with messages
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    let { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const lowered = usernameOrEmail.trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ email: lowered }, { username: usernameOrEmail }],
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
