const createSubscription = require('../../fluent-quest.Application/features/subscription/request/createSubscription');
const updateSubscription = require('../../fluent-quest.Application/features/subscription/request/updateSubscription');
const cancelSubscription = require('../../fluent-quest.Application/features/subscription/request/cancelSubscription');
const handleSubscriptionWebhook = require('../../fluent-quest.Application/features/subscription/request/handleSubscriptionWebhook');
const getSubscription = require('../../fluent-quest.Application/features/subscription/response/getSubscription');
const getUserFeatures = require('../../fluent-quest.Application/features/subscription/response/getUserFeatures');
const { stripe } = require('../../fluent-quest.Services/external-services/stripe');
const usersModel = require('../../fluent-quest.Domain/model/user.model');

// Create subscription checkout session
exports.createSubscription = async (req, res) => {
    try {
        // Get user ID from auth token
        const userEmail = req.user?.email;
        const user = await usersModel.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'User not found',
                data: null,
            });
        }

        const result = await createSubscription.create({
            userId: user._id,
            tier: req.body.tier,
            successUrl: req.body.successUrl,
            cancelUrl: req.body.cancelUrl,
        });
        
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message || 'Internal server error',
            data: null,
        });
    }
};

// Update subscription tier
exports.updateSubscription = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        const user = await usersModel.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'User not found',
                data: null,
            });
        }

        const result = await updateSubscription.update({
            userId: user._id,
            tier: req.body.tier,
        });
        
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message || 'Internal server error',
            data: null,
        });
    }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        const user = await usersModel.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'User not found',
                data: null,
            });
        }

        const result = await cancelSubscription.cancel({
            userId: user._id,
            cancelImmediately: req.body.cancelImmediately || false,
        });
        
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message || 'Internal server error',
            data: null,
        });
    }
};

// Get user's subscription
exports.getSubscription = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        const user = await usersModel.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'User not found',
                data: null,
            });
        }

        const result = await getSubscription.getByUserId(user._id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message || 'Internal server error',
            data: null,
        });
    }
};

// Get user's available features
exports.getUserFeatures = async (req, res) => {
    try {
        const userEmail = req.user?.email;
        const user = await usersModel.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'User not found',
                data: null,
            });
        }

        const result = await getUserFeatures.getByUserId(user._id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message || 'Internal server error',
            data: null,
        });
    }
};

// Handle Stripe subscription webhook
exports.subscriptionWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Subscription webhook signature verification failed:', err.message);
        return res.status(400).json({
            success: false,
            message: `Webhook Error: ${err.message}`,
        });
    }

    // Handle the webhook event
    const result = await handleSubscriptionWebhook.handle(event);
    
    // Return a response to acknowledge receipt of the event
    res.json({ received: true, result });
};

