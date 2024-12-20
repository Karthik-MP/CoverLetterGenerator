const express = require("express");
const router = express.Router();
const { createCoverLetter } = require("../controllers/coverLetterController");

// POST /api/cover-letters
router.post("/", createCoverLetter);

module.exports = router;
