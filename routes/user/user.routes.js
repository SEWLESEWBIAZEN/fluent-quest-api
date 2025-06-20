const express = require("express");

// controller imports
const userController = require("../../controllers/user.controller");

const userRoutes = express.Router();


// Routes...
userRoutes.post("/register", userController.registerUser);
userRoutes.get("/getAll", userController.getUsers);
userRoutes.get("/user/:id", userController.getUser);

// userRoutes.post("/login", login);

// userRoutes.post("/forgotpw", forgotPassword);
// userRoutes.post("/resetpw", resetPassword);

// userRoutes.use(auth);

// // Protected routes...
// userRoutes.get("/dashboard", userDashboard);

module.exports = userRoutes;