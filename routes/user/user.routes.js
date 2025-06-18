const express = require("express");
const register = require("../../controllers/userControllers/register");
// const login = require("../../controllers/authControllers/login");
// const userDashboard = require("../../controllers/userControllers/userDashboard");
// const auth = require("../../middleware/auth");
// const forgotPassword = require("../../controllers/userControllers/forgotPassword");
// const resetPassword = require("../../controllers/authControllers/resetPassword");

const userRoutes = express.Router();


// Routes...
userRoutes.post("/register", register);
// userRoutes.post("/login", login);

// userRoutes.post("/forgotpw", forgotPassword);
// userRoutes.post("/resetpw", resetPassword);

// userRoutes.use(auth);

// // Protected routes...
// userRoutes.get("/dashboard", userDashboard);

module.exports = userRoutes;