const subscriptionModel = require('../../../../fluent-quest.Domain/model/subscription.model');
const { getTierFeatures, getTierLimits } = require('../../../../fluent-quest.Services/config/featureFlags');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

/**
 * Get user's subscription details
 */
exports.getByUserId = async (userId) => {
    try {
        const subscription = await subscriptionModel.findOne({ userId });

        if (!subscription) {
            // Return default FREE subscription
            const { getTierLimits } = require('../../../../fluent-quest.Services/config/featureFlags');
            const SubscriptionTier = require('../../../../fluent-quest.Domain/enums/subscriptionTier');
            
            return createResponse({
                statusCode: 200,
                success: true,
                message: 'Subscription retrieved successfully',
                data: {
                    tier: SubscriptionTier.FREE,
                    status: 'active',
                    features: [],
                    limits: getTierLimits(SubscriptionTier.FREE),
                },
            });
        }

        const features = getTierFeatures(subscription.tier);
        const limits = getTierLimits(subscription.tier);

        const payload = {
            subscriptionId: subscription._id,
            tier: subscription.tier,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            canceledAt: subscription.canceledAt,
            isActive: subscription.isActive,
            isTrial: subscription.isTrial,
            features: features,
            limits: limits,
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Subscription retrieved successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to retrieve subscription',
            data: null,
        });
    }
};

