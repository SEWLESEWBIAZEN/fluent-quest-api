const express = require("express");
const {upload} = require('../middleware/multerMiddleware')
const {redisCacheMiddleware} = require('../middleware/cacheMiddleware')
// controller imports
const userController = require("../controllers/user.controller");
const userRoutes = express.Router();

// Routes...
userRoutes.post("/register", userController.registerUser);
userRoutes.get("/getAll", redisCacheMiddleware(), userController.getUsers);
userRoutes.get("/getAllTeachers", redisCacheMiddleware(), userController.getTeachers);
userRoutes.get("/user-by-id/:id", redisCacheMiddleware(), userController.getUser);
userRoutes.get("/user-by-email/:email", redisCacheMiddleware(), userController.getUserByEmail);
userRoutes.put("/user/update/:id", userController.updateUser);
userRoutes.post("/user/upload-avatar/:id",upload.single('file'), userController.uploadAvatar);
userRoutes.delete(`/user/delete`, userController.deleteUser);


module.exports = userRoutes;