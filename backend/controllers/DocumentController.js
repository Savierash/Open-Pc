const fs = require("fs");
const multer = require("multer");
const path = require("path");
const TechRequest = require("../models/TechRequest");

// ✅ Ensure uploads/documents folder exists before multer runs
const uploadDir = path.join(__dirname, "..", "uploads", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads/documents folder automatically");
}

// === Configure file storage ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // ✅ use absolute path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// === Upload documents & update tech request ===
exports.uploadDocuments = [
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "validId", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { email, firstName, lastName, contactNo, address } = req.body;

      // ✅ Validation: ensure email is passed
      if (!email) {
        return res.status(400).json({ message: "Missing email in form data." });
      }

      // ✅ Validation: ensure files exist
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
      }

      // ✅ Safe file paths
      const resumePath = req.files.resume?.[0]
        ? `/uploads/documents/${req.files.resume[0].filename}`
        : null;
      const birthPath = req.files.birthCertificate?.[0]
        ? `/uploads/documents/${req.files.birthCertificate[0].filename}`
        : null;
      const idPath = req.files.validId?.[0]
        ? `/uploads/documents/${req.files.validId[0].filename}`
        : null;

      // ✅ Find or create TechRequest (technician only)
      let request = await TechRequest.findOne({ email });

      if (!request) {
        // Create if missing
        request = new TechRequest({
          firstName,
          lastName,
          email,
          contactNo,
          address,
          documents: [],
          status: "pending",
        });
      }

      // ✅ Update document paths
      const uploadedDocs = [resumePath, birthPath, idPath].filter(Boolean);
      request.documents = uploadedDocs;
      request.status = "pending"; // remain pending until admin reviews
      request.address = address;
      request.contactNo = contactNo;

      await request.save();

      console.log(`✅ Updated TechRequest documents for ${email}`);

      // ✅ Send back success response
      return res.status(200).json({
        success: true,
        message: "Documents uploaded successfully.",
        data: request,
      });
    } catch (err) {
      console.error("❌ Upload error:", err);
      return res
        .status(500)
        .json({ message: "Upload failed. Please try again later." });
    }
  },
];
