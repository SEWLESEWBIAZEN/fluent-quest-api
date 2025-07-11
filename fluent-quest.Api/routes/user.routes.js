const express = require("express");
const {upload} = require('../middleware/multerMiddleware')

// controller imports
const userController = require("../controllers/user.controller");

const userRoutes = express.Router();

// Routes...
userRoutes.post("/register", userController.registerUser);
userRoutes.get("/getAll", userController.getUsers);
userRoutes.get("/getAllTeachers", userController.getTeachers);
userRoutes.get("/user-by-id/:id", userController.getUser);
userRoutes.get("/user-by-email/:email", userController.getUserByEmail);
userRoutes.put("/user/update/:id", userController.updateUser);
userRoutes.post("/user/upload-avatar/:id",upload.single('file'), userController.uploadAvatar);
userRoutes.delete(`/user/delete`, userController.deleteUser);


module.exports = userRoutes;