const TechRequest = require("../models/TechRequest");
const User = require("../models/Users");
const sendEmail = require("../utils/sendEmail");

/**
 * ✅ GET /api/tech-requests
 * Returns all technician requests (default: pending)
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await TechRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Error fetching tech requests:", err);
    res.status(500).json({ message: "Server error fetching tech requests" });
  }
};

/**
 * ✅ PATCH /api/tech-requests/:id/accept
 * Approves a technician request
 */
exports.acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await TechRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update TechRequest status
    request.status = "accepted";
    await request.save();

    // ✅ Activate and verify the corresponding user
    const user = await User.findOne({ email: request.email });
    if (user) {
      user.isVerified = true; // can now log in
      user.isActive = true; // ✅ ensure visible in admin technician list
      await user.save();
    }

    // ✅ Send approval email
    const html = `
      <h2>🎉 Congratulations!</h2>
      <p>Your technician account has been <b>approved</b> by the admin.</p>
      <p>You can now log in and access your technician dashboard.</p>
    `;
    await sendEmail(request.email, "Technician Application Approved", html);

    res.status(200).json({ message: "✅ Technician approved successfully" });
  } catch (err) {
    console.error("❌ Error approving request:", err);
    res.status(500).json({ message: "Server error approving technician" });
  }
};

/**
 * ✅ PATCH /api/tech-requests/:id/reject
 * Rejects a technician request
 */
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await TechRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update status
    request.status = "rejected";
    await request.save();

    // ✅ Deactivate the corresponding user (prevent login)
    const user = await User.findOne({ email: request.email });
    if (user) {
      user.isVerified = false;
      user.isActive = false;
      await user.save();
    }

    // ✅ Send rejection email
    const html = `
      <h2>Application Update</h2>
      <p>We regret to inform you that your technician registration has been <b>rejected</b>.</p>
      <p>If you believe this was an error, please contact support.</p>
    `;
    await sendEmail(request.email, "Technician Application Rejected", html);

    res.status(200).json({ message: "❌ Technician request rejected" });
  } catch (err) {
    console.error("❌ Error rejecting request:", err);
    res.status(500).json({ message: "Server error rejecting technician" });
  }
};
