const express = require("express");
const router = express.Router();
const { uploadDocuments } = require("../controllers/DocumentController");

router.post("/upload", uploadDocuments);

module.exports = router;
