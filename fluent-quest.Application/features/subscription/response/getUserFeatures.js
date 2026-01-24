const subscriptionModel = require('../../../../fluent-quest.Domain/model/subscription.model');
const { FEATURE_FLAGS, getTierFeatures, getTierLimits } = require('../../../../fluent-quest.Services/config/featureFlags');
const SubscriptionTier = require('../../../../fluent-quest.Domain/enums/subscriptionTier');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

/**
 * Get all features available to user
 */
exports.getByUserId = async (userId) => {
    try {
        const subscription = await subscriptionModel.findOne({ userId });
        const tier = subscription?.tier || SubscriptionTier.FREE;

        const availableFeatures = getTierFeatures(tier);
        const limits = getTierLimits(tier);

        // Build feature details
        const features = Object.keys(FEATURE_FLAGS).map(key => ({
            key: FEATURE_FLAGS[key].key,
            name: FEATURE_FLAGS[key].name,
            description: FEATURE_FLAGS[key].description,
            available: FEATURE_FLAGS[key][tier] === true,
        }));

        const payload = {
            tier,
            features,
            limits,
            availableFeatureKeys: availableFeatures,
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'User features retrieved successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to retrieve user features',
            data: null,
        });
    }
};

