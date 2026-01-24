const express = require('express');
const subscriptionRoutes = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authCheck } = require('../middleware/authMiddleware');

// Webhook endpoint - raw body is handled in inject-express.js
subscriptionRoutes.post('/webhook', subscriptionController.subscriptionWebhook);

// All other routes require authentication
subscriptionRoutes.use(authCheck);

// Subscription management
subscriptionRoutes.post('/create', subscriptionController.createSubscription);
subscriptionRoutes.put('/update', subscriptionController.updateSubscription);
subscriptionRoutes.post('/cancel', subscriptionController.cancelSubscription);
subscriptionRoutes.get('/current', subscriptionController.getSubscription);
subscriptionRoutes.get('/features', subscriptionController.getUserFeatures);

module.exports = subscriptionRoutes;

