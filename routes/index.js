const express = require('express');
const userRoutes = require('./user/user.routes');

const router = express.Router();

// API routes
router.use('/users', userRoutes);


module.exports = router;