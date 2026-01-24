const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const subscriptionModel = require('../../../../fluent-quest.Domain/model/subscription.model');
const usersModel = require('../../../../fluent-quest.Domain/model/user.model');
const SubscriptionTier = require('../../../../fluent-quest.Domain/enums/subscriptionTier');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

/**
 * Create a new subscription for a user
 * This creates a Stripe customer, subscription, and checkout session
 */
exports.create = async (reqData) => {
    const { userId, tier, successUrl, cancelUrl } = reqData;

    try {
        // Validate tier
        if (!Object.values(SubscriptionTier).includes(tier)) {
            return createResponse({
                statusCode: 400,
                success: false,
                message: 'Invalid subscription tier',
                data: null,
            });
        }

        // Don't allow creating FREE subscription (it's default)
        if (tier === SubscriptionTier.FREE) {
            return createResponse({
                statusCode: 400,
                success: false,
                message: 'Cannot create free subscription. Users start with free tier by default.',
                data: null,
            });
        }

        // Get user
        const user = await usersModel.findById(userId);
        if (!user) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: 'User not found',
                data: null,
            });
        }

        // Check if user already has an active subscription
        const existingSubscription = await subscriptionModel.findOne({ userId });
        if (existingSubscription && existingSubscription.status === 'active') {
            return createResponse({
                statusCode: 400,
                success: false,
                message: 'User already has an active subscription. Use update endpoint to change tier.',
                data: null,
            });
        }

        // Get or create Stripe customer
        let customerId = existingSubscription?.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: userId.toString(),
                },
            });
            customerId = customer.id;
        }

        // Create Stripe Checkout Session for subscription
        // Note: You need to create products and prices in Stripe Dashboard first
        // Price IDs should be stored in environment variables or config
        const priceId = process.env[`STRIPE_PRICE_ID_${tier.toUpperCase()}`];
        if (!priceId) {
            return createResponse({
                statusCode: 500,
                success: false,
                message: `Stripe price ID not configured for tier: ${tier}`,
                data: null,
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/cancel`,
            metadata: {
                userId: userId.toString(),
                tier: tier,
            },
            subscription_data: {
                metadata: {
                    userId: userId.toString(),
                    tier: tier,
                },
            },
        });

        // Create or update subscription record
        const subscription = await subscriptionModel.findOneAndUpdate(
            { userId },
            {
                userId,
                tier,
                stripeCustomerId: customerId,
                status: 'incomplete', // Will be updated by webhook
                metadata: {
                    checkoutSessionId: session.id,
                },
            },
            { upsert: true, new: true }
        );

        const payload = {
            subscriptionId: subscription._id,
            sessionId: session.id,
            url: session.url,
            tier: subscription.tier,
            status: subscription.status,
        };

        return createResponse({
            statusCode: 201,
            success: true,
            message: 'Subscription checkout session created successfully',
            data: payload,
        });
    } catch (error) {
        console.error('Create subscription error:', error);
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to create subscription',
            data: null,
        });
    }
};

