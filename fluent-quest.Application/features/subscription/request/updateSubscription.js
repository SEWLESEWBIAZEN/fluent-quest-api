const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const subscriptionModel = require('../../../../fluent-quest.Domain/model/subscription.model');
const SubscriptionTier = require('../../../../fluent-quest.Domain/enums/subscriptionTier');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

/**
 * Update subscription tier (upgrade/downgrade)
 */
exports.update = async (reqData) => {
    const { userId, tier } = reqData;

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

        // Get existing subscription
        const subscription = await subscriptionModel.findOne({ userId });
        if (!subscription) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: 'Subscription not found',
                data: null,
            });
        }

        // If same tier, return current subscription
        if (subscription.tier === tier) {
            return createResponse({
                statusCode: 200,
                success: true,
                message: 'Subscription tier unchanged',
                data: {
                    subscriptionId: subscription._id,
                    tier: subscription.tier,
                    status: subscription.status,
                },
            });
        }

        // If no Stripe subscription, create new one
        if (!subscription.stripeSubscriptionId) {
            return createResponse({
                statusCode: 400,
                success: false,
                message: 'No active Stripe subscription found. Please create a subscription first.',
                data: null,
            });
        }

        // Get new price ID for the tier
        const newPriceId = process.env[`STRIPE_PRICE_ID_${tier.toUpperCase()}`];
        if (!newPriceId) {
            return createResponse({
                statusCode: 500,
                success: false,
                message: `Stripe price ID not configured for tier: ${tier}`,
                data: null,
            });
        }

        // Update Stripe subscription
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        
        // Update subscription with new price
        const updatedStripeSubscription = await stripe.subscriptions.update(
            subscription.stripeSubscriptionId,
            {
                items: [{
                    id: stripeSubscription.items.data[0].id,
                    price: newPriceId,
                }],
                proration_behavior: 'always_invoice', // Prorate the difference
                metadata: {
                    userId: userId.toString(),
                    tier: tier,
                },
            }
        );

        // Update subscription in database
        const updatedSubscription = await subscriptionModel.findOneAndUpdate(
            { userId },
            {
                tier,
                stripePriceId: newPriceId,
                currentPeriodStart: new Date(updatedStripeSubscription.current_period_start * 1000),
                currentPeriodEnd: new Date(updatedStripeSubscription.current_period_end * 1000),
                status: updatedStripeSubscription.status,
            },
            { new: true }
        );

        const payload = {
            subscriptionId: updatedSubscription._id,
            tier: updatedSubscription.tier,
            status: updatedSubscription.status,
            currentPeriodStart: updatedSubscription.currentPeriodStart,
            currentPeriodEnd: updatedSubscription.currentPeriodEnd,
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Subscription updated successfully',
            data: payload,
        });
    } catch (error) {
        console.error('Update subscription error:', error);
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to update subscription',
            data: null,
        });
    }
};

