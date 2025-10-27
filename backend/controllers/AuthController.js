// backend/controllers/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');
const User = require('../models/Users');

/**
 * Register
 * Accepts: { email, username, password, confirmPassword, roleKey? }
 * Behavior: same as your existing register, but optionally attaches role by key
 */
exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, roleKey } = req.body;
    if (!email || !username || !password) return res.status(400).json({ message: 'Missing fields' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // If a roleKey is provided, fetch the role and attach
    let assignedRole = null;
    if (roleKey) {
      assignedRole = await Role.findOne({ key: roleKey });
      if (!assignedRole) return res.status(400).json({ message: 'Invalid role' });
    }

    // Keep your field naming (password) consistent with existing model
    const user = new User({
      email,
      username,
      password: hashed,
      role: assignedRole ? assignedRole._id : undefined,
    });

    await user.save();

    // include role key in token payload if assigned
    const tokenPayload = { id: user._id, email: user.email };
    if (assignedRole) tokenPayload.role = assignedRole.key;

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    // respond like your original register (token + user)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: assignedRole ? assignedRole.key : undefined,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login
 * Supports:
 * - { email, password }  (original)
 * - { usernameOrEmail, password } (your second variant)
 * Behavior: verify creds, set httpOnly cookie, return token + user
 */
exports.login = async (req, res) => {
  try {
    const { email, password, usernameOrEmail } = req.body;

    // Determine search criteria:
    let user;
    if (usernameOrEmail) {
      user = await User.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      }).populate('role');
    } else if (email) {
      user = await User.findOne({ email }).populate('role');
    } else {
      return res.status(400).json({ message: 'Missing fields' });
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

    // Build token payload (include role key if populated)
    const tokenPayload = { id: user._id, email: user.email };
    if (user.role && user.role.key) tokenPayload.role = user.role.key;

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    // set cookie for session-based usage (keeps backward compatibility)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set true in production when using HTTPS
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Response: include token and user info (sanitized)
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role && user.role.key ? user.role.key : undefined,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET available roles
 * Returns: { success: true, roles: [{ key, name, description }, ...] }
 */
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().select('key name description').lean();
    res.status(200).json({ success: true, roles });
  } catch (err) {
    console.error('Get Roles Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
