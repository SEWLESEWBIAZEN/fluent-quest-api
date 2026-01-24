const express = require('express');
const paymentRoutes = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authCheck } = require('../middleware/authMiddleware');

// Webhook endpoint - raw body is handled in inject-express.js
// Stripe webhooks need raw body for signature verification
paymentRoutes.post('/webhook', paymentController.webhook);

// All other routes require authentication
paymentRoutes.use(authCheck);

// Product management
paymentRoutes.post('/create-product', paymentController.createProduct);
paymentRoutes.put('/update-price', paymentController.updatePrice);

// Checkout
paymentRoutes.post('/checkout', paymentController.createCheckout);

// Dashboard and payments
paymentRoutes.get('/dashboard', paymentController.getDashboard);
paymentRoutes.get('/payments', paymentController.getPayments);
paymentRoutes.get('/payments/:paymentId', paymentController.getPaymentById);

module.exports = paymentRoutes;

