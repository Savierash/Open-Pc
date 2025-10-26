// backend/routes/forgotPassword.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const sendEmail = require('../utils/sendEmail');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.get('/test-email', async (req, res) => {
  try {
    const success = await sendEmail(
      process.env.EMAIL_USER,
      'Test Email from Open-PC Backend',
      '<p>If you can read this, your email setup works 🎉</p>'
    );

    if (success) res.json({ message: '✅ Test email sent successfully!' });
    else res.status(500).json({ message: '❌ Failed to send test email' });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ message: 'Email error', error: err.message });
  }
});

// === POST /api/forgot-password/send-otp ===
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate and save OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    await user.save();

    // Email content
    const subject = 'Open-PC Password Reset OTP';
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Open-PC Password Reset</h2>
        <p>Hello <b>${user.username}</b>,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color: #2F54EB;">${otp}</h1>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <br>
        <p>— The Open-PC Team</p>
      </div>
    `;

    // Send email using sendEmail.js
    const sent = await sendEmail(email, subject, html);
    if (!sent) return res.status(500).json({ message: 'Failed to send OTP email' });

    console.log(`✅ OTP ${otp} sent to ${email}`);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('send-otp error:', err);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
});

// === POST /api/forgot-password/reset-password ===
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate OTP
    if (!user.otp || user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });
    if (Date.now() > user.otpExpires)
      return res.status(400).json({ message: 'OTP expired' });

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
});

module.exports = router;
