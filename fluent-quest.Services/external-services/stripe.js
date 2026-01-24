const Stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

module.exports = { stripe };

