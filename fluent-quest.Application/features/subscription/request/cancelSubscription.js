const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const subscriptionModel = require('../../../../fluent-quest.Domain/model/subscription.model');
const SubscriptionTier = require('../../../../fluent-quest.Domain/enums/subscriptionTier');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

/**
 * Cancel subscription (at period end or immediately)
 */
exports.cancel = async (reqData) => {
    const { userId, cancelImmediately = false } = reqData;

    try {
        // Get subscription
        const subscription = await subscriptionModel.findOne({ userId });
        if (!subscription) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: 'Subscription not found',
                data: null,
            });
        }

        if (!subscription.stripeSubscriptionId) {
            return createResponse({
                statusCode: 400,
                success: false,
                message: 'No active Stripe subscription found',
                data: null,
            });
        }

        if (cancelImmediately) {
            // Cancel immediately
            await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
            
            await subscriptionModel.findOneAndUpdate(
                { userId },
                {
                    status: 'canceled',
                    canceledAt: new Date(),
                    cancelAtPeriodEnd: false,
                }
            );

            // Downgrade to FREE tier
            await subscriptionModel.findOneAndUpdate(
                { userId },
                { tier: SubscriptionTier.FREE },
                { new: true }
            );
        } else {
            // Cancel at period end
            await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
                cancel_at_period_end: true,
            });

            await subscriptionModel.findOneAndUpdate(
                { userId },
                {
                    cancelAtPeriodEnd: true,
                }
            );
        }

        const updatedSubscription = await subscriptionModel.findOne({ userId });

        const payload = {
            subscriptionId: updatedSubscription._id,
            tier: updatedSubscription.tier,
            status: updatedSubscription.status,
            cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
            canceledAt: updatedSubscription.canceledAt,
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: cancelImmediately 
                ? 'Subscription canceled immediately' 
                : 'Subscription will be canceled at period end',
            data: payload,
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to cancel subscription',
            data: null,
        });
    }
};

