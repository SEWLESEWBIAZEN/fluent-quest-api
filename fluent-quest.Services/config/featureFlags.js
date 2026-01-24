const SubscriptionTier = require('../../fluent-quest.Domain/enums/subscriptionTier');

/**
 * Feature Flags Configuration
 * Defines which features are available for each subscription tier
 * 
 * To add a new feature:
 * 1. Add the feature key to all tiers (set to false for tiers that don't have access)
 * 2. Use the feature key in your middleware: featureCheck('premium_courses')
 */
const FEATURE_FLAGS = {
    // Course Features
    PREMIUM_COURSES: {
        key: 'premium_courses',
        name: 'Premium Courses Access',
        description: 'Access to premium courses',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: true,
        [SubscriptionTier.PRO]: true,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    UNLIMITED_COURSES: {
        key: 'unlimited_courses',
        name: 'Unlimited Courses',
        description: 'No limit on course enrollments',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false, // Basic: 5 courses max
        [SubscriptionTier.PRO]: true,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    ADVANCED_ANALYTICS: {
        key: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Access to detailed learning analytics',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false,
        [SubscriptionTier.PRO]: true,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    
    // Learning Features
    OFFLINE_MODE: {
        key: 'offline_mode',
        name: 'Offline Mode',
        description: 'Download courses for offline learning',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false,
        [SubscriptionTier.PRO]: true,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    CERTIFICATES: {
        key: 'certificates',
        name: 'Course Certificates',
        description: 'Receive certificates upon course completion',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: true,
        [SubscriptionTier.PRO]: true,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    PRIORITY_SUPPORT: {
        key: 'priority_support',
        name: 'Priority Support',
        description: '24/7 priority customer support',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false,
        [SubscriptionTier.PRO]: true,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    
    // Enterprise Features
    CUSTOM_BRANDING: {
        key: 'custom_branding',
        name: 'Custom Branding',
        description: 'Custom branding and white-label options',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false,
        [SubscriptionTier.PRO]: false,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    API_ACCESS: {
        key: 'api_access',
        name: 'API Access',
        description: 'Access to REST API for integrations',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false,
        [SubscriptionTier.PRO]: false,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    TEAM_MANAGEMENT: {
        key: 'team_management',
        name: 'Team Management',
        description: 'Manage team members and permissions',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false,
        [SubscriptionTier.PRO]: false,
        [SubscriptionTier.ENTERPRISE]: true,
    },
    SSO: {
        key: 'sso',
        name: 'Single Sign-On',
        description: 'SSO integration for enterprise',
        [SubscriptionTier.FREE]: false,
        [SubscriptionTier.BASIC]: false,
        [SubscriptionTier.PRO]: false,
        [SubscriptionTier.ENTERPRISE]: true,
    },
};

/**
 * Subscription Tier Limits
 * Defines limits for each tier (e.g., max courses, max users, etc.)
 */
const TIER_LIMITS = {
    [SubscriptionTier.FREE]: {
        maxCourses: 2,
        maxUsers: 1,
        maxStorage: 100, // MB
        maxApiCalls: 0,
    },
    [SubscriptionTier.BASIC]: {
        maxCourses: 5,
        maxUsers: 1,
        maxStorage: 500, // MB
        maxApiCalls: 0,
    },
    [SubscriptionTier.PRO]: {
        maxCourses: -1, // unlimited
        maxUsers: 5,
        maxStorage: 5000, // MB
        maxApiCalls: 10000, // per month
    },
    [SubscriptionTier.ENTERPRISE]: {
        maxCourses: -1, // unlimited
        maxUsers: -1, // unlimited
        maxStorage: -1, // unlimited
        maxApiCalls: -1, // unlimited
    },
};

/**
 * Check if a tier has access to a feature
 * @param {string} tier - Subscription tier
 * @param {string} featureKey - Feature key
 * @returns {boolean}
 */
function hasFeatureAccess(tier, featureKey) {
    const feature = FEATURE_FLAGS[featureKey];
    if (!feature) {
        console.warn(`Feature ${featureKey} not found in feature flags`);
        return false;
    }
    return feature[tier] === true;
}

/**
 * Get all features for a tier
 * @param {string} tier - Subscription tier
 * @returns {Array} Array of feature keys
 */
function getTierFeatures(tier) {
    return Object.keys(FEATURE_FLAGS).filter(key => 
        FEATURE_FLAGS[key][tier] === true
    );
}

/**
 * Get tier limits
 * @param {string} tier - Subscription tier
 * @returns {Object} Tier limits
 */
function getTierLimits(tier) {
    return TIER_LIMITS[tier] || TIER_LIMITS[SubscriptionTier.FREE];
}

module.exports = {
    FEATURE_FLAGS,
    TIER_LIMITS,
    hasFeatureAccess,
    getTierFeatures,
    getTierLimits,
};

