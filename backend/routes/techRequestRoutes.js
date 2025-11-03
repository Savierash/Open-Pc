// backend/routes/techRequestRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/techRequestController");

// GET all technician requests
router.get("/", getAllRequests);

// PATCH accept technician
router.patch("/:id/accept", acceptRequest);

// PATCH reject technician
router.patch("/:id/reject", rejectRequest);

module.exports = router;
