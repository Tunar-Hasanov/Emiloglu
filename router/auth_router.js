const express = require("express");
const router = express.Router();

// Importing the auth validation functions for login and register
const { registerValidation, loginValidation } = require("../middlewares/authvalidation_middleware.js");

// Importing functions from auth controller
const { login, register, userProfile, users } = require("../controllers/auth_controller.js");

// Importing the JWT verifier from auth middleware
const verifyToken = require("../middlewares/auth_middleware.js");

// Register route with register validation
router.post("/register", registerValidation, register);

// Login route with login validation
router.post("/login", loginValidation, login);

// Profile route with token verification
router.get("/profile/:id", verifyToken, userProfile);

// All users route with token verification
router.get("/users", verifyToken, users);

module.exports = router;
