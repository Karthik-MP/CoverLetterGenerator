const express = require("express");
const router = express.Router();
const { createCoverLetter } = require("../controllers/coverLetter");

// POST /api/cover-letters
router.post("/", createCoverLetter);

module.exports = router;
