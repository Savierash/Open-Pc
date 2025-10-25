// utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env variables

/**
 * Sends an email using Nodemailer.
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject line of the email
 * @param {string} html - HTML content of the email body
 */
const sendEmail = async (to, subject, html) => {
  try {
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Using Gmail
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // Email options
    const mailOptions = {
      from: `"Open-PC Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}: ${info.response}`);
    return true;

  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    return false;
  }
};

module.exports = sendEmail;
