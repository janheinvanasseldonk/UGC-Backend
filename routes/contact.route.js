const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");

// Define a POST route for form submissions
router.post("/submit", contactController.sendContactEmail);

module.exports = router;
