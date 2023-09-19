const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

// Handle user login
router.post("/login", authController.loginUser);

// Handle user registration
router.post("/register", authController.registerUser);

module.exports = router;
