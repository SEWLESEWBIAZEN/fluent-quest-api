const express = require('express');
const userRoutes = require('./user.routes');
const languageRoutes = require('./language.routes');

const router = express.Router();

// Middleware imports
const { authCheck, adminCheck } = require('../middleware/authMiddleware');

// Middleware for authentication and authorization
//router.use(authCheck); // Apply authCheck middleware to all routes
//router.use(adminCheck); // Apply adminCheck middleware to all routes that require admin privileges

// API routes
router.use('/users', userRoutes);
router.use('/languages', languageRoutes);

module.exports = router;