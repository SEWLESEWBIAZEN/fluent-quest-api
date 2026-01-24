const mongoose = require('mongoose');
const SubscriptionTier = require('../enums/subscriptionTier');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User ID is required'],
      unique: true,
    },
    tier: {
      type: String,
      enum: Object.values(SubscriptionTier),
      default: SubscriptionTier.FREE,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    stripeCustomerId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    stripePriceId: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete', 'incomplete_expired', 'paused'],
      default: 'active',
      required: true,
    },
    currentPeriodStart: {
      type: Date,
      required: false,
    },
    currentPeriodEnd: {
      type: Date,
      required: false,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
      required: false,
    },
    trialStart: {
      type: Date,
      required: false,
    },
    trialEnd: {
      type: Date,
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ stripeCustomerId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ tier: 1 });

// Virtual to check if subscription is active
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' || this.status === 'trialing';
});

// Virtual to check if subscription is in trial
subscriptionSchema.virtual('isTrial').get(function() {
  return this.status === 'trialing' && this.trialEnd && this.trialEnd > new Date();
});

// Method to check if subscription has access to a feature
subscriptionSchema.methods.hasFeature = function(featureKey) {
  const { hasFeatureAccess } = require('../../fluent-quest.Services/config/featureFlags');
  return hasFeatureAccess(this.tier, featureKey);
};

// Method to get subscription limits
subscriptionSchema.methods.getLimits = function() {
  const { getTierLimits } = require('../../fluent-quest.Services/config/featureFlags');
  return getTierLimits(this.tier);
};

const subscriptionModel = mongoose.model('subscriptions', subscriptionSchema);
module.exports = subscriptionModel;

