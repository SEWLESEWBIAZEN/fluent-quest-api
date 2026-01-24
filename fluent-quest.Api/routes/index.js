const express = require('express');
const userRoutes = require('./user.routes');
const languageRoutes = require('./language.routes');
const languageLevelRoutes =require( './languageLevel.routes')
const courseRoutes =require( './course.routes')
const lessonRoutes =require( './lesson.routes')
const paymentRoutes = require('./payment.routes')
const subscriptionRoutes = require('./subscription.routes')


const router = express.Router();

// Middleware imports
const { authCheck, adminCheck } = require('../../fluent-quest.Api/middleware/authMiddleware');

// Middleware for authentication and authorization
 //router.use(authCheck); // Apply authCheck middleware to all routes
//router.use(adminCheck); // Apply adminCheck middleware to all routes that require admin privileges

// API routes
router.use('/users', userRoutes);
router.use('/languages', languageRoutes);
router.use('/languageLevels', languageLevelRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/payments', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);


module.exports = router;