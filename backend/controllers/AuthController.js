// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');
const User = require('../models/Users');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');

// ✅ Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Generate unique technician ID (e.g. TECH-XYZ123)
const generateTechId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${randomPart}`;
};

/**
 * Register
 * 🚀 Creates user and sends OTP to email
 */
exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, roleKey, firstName, lastName, gender , contactNumber } = req.body;

    if (!email || !username || !password || !firstName || !lastName || !gender)
      return res.status(400).json({ message: 'Missing required fields' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const role = await Role.findOne({ key: roleKey });
    if (!role) return res.status(400).json({ message: 'Invalid role' });

    const user = new User({
      email,
      username,
      password: hashed,
      role: role._id,
      isVerified: false,
      firstName,
      lastName,
      gender,
      contactNumber, // ✅ Save it here
    });

    if (role.key === 'technician') {
      user.techId = generateTechId();
    }

    await user.save();

    const otpCode = generateOtp();
    await Otp.create({ email, otp: otpCode });

    // ✅ Email template
    const htmlContent = `
      <h2>Welcome to Open-PC!</h2>
      <p>Please verify your email using the OTP below:</p>
      <h1>${otpCode}</h1>
      <p>Expires in 10 minutes.</p>
    `;
    await sendEmail(email, 'Open-PC Account Verification', htmlContent);

    return res.status(200).json({
      message: 'Registered successfully. Check your email for OTP.',
      email,
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * ✅ Verify OTP and activate account
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    await Otp.deleteMany({ email });

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    ).populate('role');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign(
      { id: user._id, role: user.role.key },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role.key,
      },
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ message: 'Email verification error' });
  }
};

/**
 * Login
 * 🚪 Only verified users can log in
 */
exports.login = async (req, res) => {
  try {
    const { email, password, usernameOrEmail } = req.body;
    let user;

    if (usernameOrEmail) {
      user = await User.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      }).populate('role');
    } else if (email) {
      user = await User.findOne({ email }).populate('role');
    } else {
      return res.status(400).json({ message: 'Missing login fields' });
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email first' });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role.key },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role.key,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server login error' });
  }
};

/**
 * ✅ Get available roles
 */
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().select('key name description').lean();
    return res.status(200).json({ success: true, roles });
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching roles' });
  }
};

// Get profile for authenticated user
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-password').populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile (phone number, username)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { phoneNumber, username } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (username !== undefined) user.username = username;
    await user.save();

    res.json({ success: true, user: { id: user._id, email: user.email, username: user.username, phoneNumber: user.phoneNumber } });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
