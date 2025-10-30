const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');
const User = require('../models/Users');
const sendEmail = require('../utils/sendEmail'); // ✅ NEW

// Helper: Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Register
 * Added: OTP creation + email sending
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

    let assignedRole = null;
    if (roleKey) {
      assignedRole = await Role.findOne({ key: roleKey });
      if (!assignedRole) return res.status(400).json({ message: 'Invalid role' });
    }

    // create unverified user
    const user = new User({
      email,
      username,
      password: hashed,
      role: assignedRole ? assignedRole._id : undefined,
      isVerified: false, // ✅ added
    });

    await user.save();

    // ✅ Generate and save OTP
    const otpCode = generateOtp();
    await Otp.create({ email, otp: otpCode });

    // ✅ Send OTP email
    const htmlContent = `
      <div style="font-family: Arial; line-height: 1.5;">
        <h2>Welcome to Open-PC!</h2>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <h1 style="letter-spacing: 3px; color: #4CAF50;">${otpCode}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `;
    await sendEmail(email, 'Open-PC Account Verification', htmlContent);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email with the OTP sent.',
      email,
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ✅ Verify OTP
 * Confirms OTP and marks user verified
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    await User.updateOne({ email }, { isVerified: true });
    await Otp.deleteMany({ email }); // delete used OTPs

    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login
 * Added check: must be verified before login
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
      return res.status(400).json({ message: 'Missing fields' });
    }

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before login' });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

    const tokenPayload = { id: user._id, email: user.email };
    if (user.role && user.role.key) tokenPayload.role = user.role.key;

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role?.key,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get available roles (unchanged)
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
