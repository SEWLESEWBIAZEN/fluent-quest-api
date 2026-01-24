const subscriptionModel = require('../../fluent-quest.Domain/model/subscription.model');
const { hasFeatureAccess } = require('../../fluent-quest.Services/config/featureFlags');
const SubscriptionTier = require('../../fluent-quest.Domain/enums/subscriptionTier');
const { createResponse } = require('../../fluent-quest.Services/utils/responseHelper');

/**
 * Middleware to check if user has access to a specific feature
 * Usage: router.get('/premium-courses', authCheck, featureCheck('premium_courses'), controller.getPremiumCourses);
 * 
 * @param {string} featureKey - Feature key from featureFlags config
 * @returns {Function} Express middleware
 */
const featureCheck = (featureKey) => {
    return async (req, res, next) => {
        try {
            // Get user ID from request (set by authCheck middleware)
            const userId = req.user?.uid || req.user?.user_id;
            
            if (!userId) {
                return res.status(401).json(createResponse({
                    statusCode: 401,
                    success: false,
                    message: 'User not authenticated',
                    data: null,
                }));
            }

            // Get user's subscription
            const subscription = await subscriptionModel.findOne({ userId });
            
            // If no subscription, default to FREE tier
            const tier = subscription?.tier || SubscriptionTier.FREE;
            
            // Check if tier has access to feature
            const hasAccess = hasFeatureAccess(tier, featureKey);
            
            if (!hasAccess) {
                return res.status(403).json(createResponse({
                    statusCode: 403,
                    success: false,
                    message: `This feature requires a ${subscription?.tier || 'paid'} subscription. Please upgrade to access this feature.`,
                    data: {
                        requiredFeature: featureKey,
                        currentTier: tier,
                        upgradeRequired: true,
                    },
                }));
            }

            // Attach subscription info to request for use in controllers
            req.subscription = subscription;
            req.userTier = tier;
            
            next();
        } catch (error) {
            console.error('Feature check error:', error);
            return res.status(500).json(createResponse({
                statusCode: 500,
                success: false,
                message: 'Error checking feature access',
                data: null,
            }));
        }
    };
};

/**
 * Middleware to check if user has a minimum tier
 * Usage: router.get('/pro-features', authCheck, tierCheck(SubscriptionTier.PRO), controller.getProFeatures);
 * 
 * @param {string} minimumTier - Minimum subscription tier required
 * @returns {Function} Express middleware
 */
const tierCheck = (minimumTier) => {
    const tierOrder = {
        [SubscriptionTier.FREE]: 0,
        [SubscriptionTier.BASIC]: 1,
        [SubscriptionTier.PRO]: 2,
        [SubscriptionTier.ENTERPRISE]: 3,
    };

    return async (req, res, next) => {
        try {
            const userId = req.user?.uid || req.user?.user_id;
            
            if (!userId) {
                return res.status(401).json(createResponse({
                    statusCode: 401,
                    success: false,
                    message: 'User not authenticated',
                    data: null,
                }));
            }

            const subscription = await subscriptionModel.findOne({ userId });
            const tier = subscription?.tier || SubscriptionTier.FREE;
            
            const userTierLevel = tierOrder[tier] || 0;
            const requiredTierLevel = tierOrder[minimumTier] || 0;
            
            if (userTierLevel < requiredTierLevel) {
                return res.status(403).json(createResponse({
                    statusCode: 403,
                    success: false,
                    message: `This feature requires ${minimumTier} subscription or higher. Your current tier: ${tier}`,
                    data: {
                        currentTier: tier,
                        requiredTier: minimumTier,
                        upgradeRequired: true,
                    },
                }));
            }

            req.subscription = subscription;
            req.userTier = tier;
            
            next();
        } catch (error) {
            console.error('Tier check error:', error);
            return res.status(500).json(createResponse({
                statusCode: 500,
                success: false,
                message: 'Error checking tier access',
                data: null,
            }));
        }
    };
};

/**
 * Helper function to check feature access in controllers (non-middleware)
 * @param {string} userId - User ID
 * @param {string} featureKey - Feature key
 * @returns {Promise<boolean>}
 */
const checkFeatureAccess = async (userId, featureKey) => {
    try {
        const subscription = await subscriptionModel.findOne({ userId });
        const tier = subscription?.tier || SubscriptionTier.FREE;
        return hasFeatureAccess(tier, featureKey);
    } catch (error) {
        console.error('Feature access check error:', error);
        return false;
    }
};

module.exports = {
    featureCheck,
    tierCheck,
    checkFeatureAccess,
};

