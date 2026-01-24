# Stripe Subscription Integration with Feature Gating - Implementation Guide

This guide provides a complete implementation of Stripe subscriptions with dynamic feature gating, enabling seamless upgrades/downgrades and scalable monetization.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup](#setup)
4. [Subscription Tiers & Features](#subscription-tiers--features)
5. [Implementation Steps](#implementation-steps)
6. [API Endpoints](#api-endpoints)
7. [Feature Gating](#feature-gating)
8. [Webhook Configuration](#webhook-configuration)
9. [Testing](#testing)
10. [Best Practices](#best-practices)

---

## Overview

This implementation provides:

- ✅ **Three Subscription Tiers**: Basic, Pro, Enterprise (plus Free tier)
- ✅ **Dynamic Feature Access**: Features enabled/disabled based on subscription tier
- ✅ **Feature Flag System**: Centralized feature management
- ✅ **Seamless Upgrades/Downgrades**: No service downtime during tier changes
- ✅ **Stripe Integration**: Secure payment processing
- ✅ **Webhook Handling**: Automatic subscription status updates
- ✅ **Scalable Architecture**: Clean architecture pattern

---

## Architecture

```
fluent-quest.Domain/
  └── enums/
      └── subscriptionTier.js          # Tier definitions (FREE, BASIC, PRO, ENTERPRISE)
  └── model/
      └── subscription.model.js        # Subscription schema

fluent-quest.Services/
  └── config/
      └── featureFlags.js             # Feature flags configuration

fluent-quest.Application/
  └── features/
      └── subscription/
          ├── request/                 # Command handlers
          │   ├── createSubscription.js
          │   ├── updateSubscription.js
          │   ├── cancelSubscription.js
          │   └── handleSubscriptionWebhook.js
          └── response/                # Query handlers
              ├── getSubscription.js
              └── getUserFeatures.js

fluent-quest.Api/
  └── controllers/
      └── subscription.controller.js   # Controller layer
  └── routes/
      └── subscription.routes.js        # Route definitions
  └── middleware/
      └── featureCheck.js              # Feature gating middleware
```

---

## Setup

### 1. Environment Variables

Add to your `.env` file:

```env
# Existing Stripe keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Subscription Price IDs (from Stripe Dashboard)
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
```

### 2. Create Products & Prices in Stripe Dashboard

1. Go to **Stripe Dashboard → Products**
2. Create products for each tier:
   - **Basic Plan** - Monthly/Yearly
   - **Pro Plan** - Monthly/Yearly
   - **Enterprise Plan** - Monthly/Yearly (or custom pricing)

3. Copy the **Price IDs** and add them to `.env`

**Example:**
```
Basic Monthly: $9.99/month → price_abc123
Pro Monthly: $29.99/month → price_def456
Enterprise Monthly: $99.99/month → price_ghi789
```

---

## Subscription Tiers & Features

### Tier Definitions

| Tier | Price | Key Features |
|------|-------|--------------|
| **Free** | $0 | Limited courses (2), Basic features |
| **Basic** | $9.99/mo | Premium courses, Certificates, 5 courses max |
| **Pro** | $29.99/mo | Unlimited courses, Advanced analytics, Offline mode, Priority support |
| **Enterprise** | Custom | All Pro features + Custom branding, API access, Team management, SSO |

### Feature Matrix

| Feature | Free | Basic | Pro | Enterprise |
|---------|------|-------|-----|------------|
| Premium Courses | ❌ | ✅ | ✅ | ✅ |
| Unlimited Courses | ❌ | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ❌ | ✅ | ✅ |
| Offline Mode | ❌ | ❌ | ✅ | ✅ |
| Certificates | ❌ | ✅ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ❌ | ✅ |
| Team Management | ❌ | ❌ | ❌ | ✅ |
| SSO | ❌ | ❌ | ❌ | ✅ |

### Tier Limits

```javascript
FREE: {
    maxCourses: 2,
    maxUsers: 1,
    maxStorage: 100 MB,
    maxApiCalls: 0
}

BASIC: {
    maxCourses: 5,
    maxUsers: 1,
    maxStorage: 500 MB,
    maxApiCalls: 0
}

PRO: {
    maxCourses: -1, // unlimited
    maxUsers: 5,
    maxStorage: 5000 MB,
    maxApiCalls: 10000/month
}

ENTERPRISE: {
    maxCourses: -1, // unlimited
    maxUsers: -1, // unlimited
    maxStorage: -1, // unlimited
    maxApiCalls: -1 // unlimited
}
```

---

## Implementation Steps

### Step 1: Database Models ✅

**Subscription Model** (`fluent-quest.Domain/model/subscription.model.js`)
- Tracks user subscriptions
- Links to Stripe subscription
- Stores tier, status, period dates
- Includes virtual methods for feature checks

### Step 2: Feature Flags Configuration ✅

**Feature Flags** (`fluent-quest.Services/config/featureFlags.js`)
- Centralized feature definitions
- Tier-based access control
- Helper functions for feature checks

### Step 3: Subscription Management ✅

**Handlers:**
- `createSubscription.js` - Create checkout session
- `updateSubscription.js` - Upgrade/downgrade tier
- `cancelSubscription.js` - Cancel subscription
- `handleSubscriptionWebhook.js` - Process Stripe events

### Step 4: Feature Gating Middleware ✅

**Middleware** (`fluent-quest.Api/middleware/featureCheck.js`)
- `featureCheck(featureKey)` - Check specific feature access
- `tierCheck(minimumTier)` - Check minimum tier requirement
- `checkFeatureAccess(userId, featureKey)` - Helper function

### Step 5: API Endpoints ✅

**Routes** (`fluent-quest.Api/routes/subscription.routes.js`)
- POST `/api/subscriptions/create` - Create subscription
- PUT `/api/subscriptions/update` - Update tier
- POST `/api/subscriptions/cancel` - Cancel subscription
- GET `/api/subscriptions/current` - Get current subscription
- GET `/api/subscriptions/features` - Get available features
- POST `/api/subscriptions/webhook` - Stripe webhook

---

## API Endpoints

### Create Subscription

**POST** `/api/subscriptions/create`

Creates a Stripe checkout session for subscription.

**Request:**
```json
{
  "tier": "pro",
  "successUrl": "https://yourdomain.com/subscription/success",
  "cancelUrl": "https://yourdomain.com/subscription/cancel"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Subscription checkout session created successfully",
  "data": {
    "subscriptionId": "sub_id",
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/...",
    "tier": "pro",
    "status": "incomplete"
  }
}
```

### Update Subscription Tier

**PUT** `/api/subscriptions/update`

Upgrade or downgrade subscription tier.

**Request:**
```json
{
  "tier": "enterprise"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "subscriptionId": "sub_id",
    "tier": "enterprise",
    "status": "active",
    "currentPeriodStart": "2024-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2024-02-01T00:00:00.000Z"
  }
}
```

### Cancel Subscription

**POST** `/api/subscriptions/cancel`

Cancel subscription (immediately or at period end).

**Request:**
```json
{
  "cancelImmediately": false
}
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Subscription will be canceled at period end",
  "data": {
    "subscriptionId": "sub_id",
    "tier": "pro",
    "status": "active",
    "cancelAtPeriodEnd": true
  }
}
```

### Get Current Subscription

**GET** `/api/subscriptions/current`

Get user's current subscription details.

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Subscription retrieved successfully",
  "data": {
    "subscriptionId": "sub_id",
    "tier": "pro",
    "status": "active",
    "currentPeriodStart": "2024-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2024-02-01T00:00:00.000Z",
    "cancelAtPeriodEnd": false,
    "isActive": true,
    "isTrial": false,
    "features": ["premium_courses", "unlimited_courses", ...],
    "limits": {
      "maxCourses": -1,
      "maxUsers": 5,
      "maxStorage": 5000,
      "maxApiCalls": 10000
    }
  }
}
```

### Get User Features

**GET** `/api/subscriptions/features`

Get all features available to user.

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User features retrieved successfully",
  "data": {
    "tier": "pro",
    "features": [
      {
        "key": "premium_courses",
        "name": "Premium Courses Access",
        "description": "Access to premium courses",
        "available": true
      },
      ...
    ],
    "limits": {...},
    "availableFeatureKeys": ["premium_courses", "unlimited_courses", ...]
  }
}
```

---

## Feature Gating

### Using Middleware

**Protect routes with feature checks:**

```javascript
const { featureCheck } = require('../middleware/featureCheck');
const { tierCheck } = require('../middleware/featureCheck');
const SubscriptionTier = require('../../fluent-quest.Domain/enums/subscriptionTier');

// Check specific feature
router.get('/premium-courses', 
  authCheck, 
  featureCheck('PREMIUM_COURSES'), 
  controller.getPremiumCourses
);

// Check minimum tier
router.get('/pro-features', 
  authCheck, 
  tierCheck(SubscriptionTier.PRO), 
  controller.getProFeatures
);
```

### In Controllers

**Check feature access programmatically:**

```javascript
const { checkFeatureAccess } = require('../middleware/featureCheck');

exports.getCourse = async (req, res) => {
    const userId = req.user.user_id;
    const course = await getCourseById(req.params.id);
    
    // Check if course is premium
    if (course.isPremium) {
        const hasAccess = await checkFeatureAccess(userId, 'PREMIUM_COURSES');
        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'Premium subscription required'
            });
        }
    }
    
    // Return course
    return res.json({ success: true, data: course });
};
```

### Frontend Integration (React Example)

```javascript
// Check user features
const checkFeature = async (featureKey) => {
    const response = await fetch('/api/subscriptions/features', {
        headers: { 'authtoken': userToken }
    });
    const { data } = await response.json();
    return data.features.find(f => f.key === featureKey)?.available || false;
};

// Usage
const hasPremiumAccess = await checkFeature('PREMIUM_COURSES');
if (hasPremiumAccess) {
    // Show premium content
} else {
    // Show upgrade prompt
}
```

---

## Webhook Configuration

### Stripe Dashboard Setup

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Add endpoint: `https://yourdomain.com/api/subscriptions/webhook`
3. Select events:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

### Webhook Events Handled

| Event | Action |
|-------|--------|
| `customer.subscription.created` | Create subscription record |
| `customer.subscription.updated` | Update subscription status/tier |
| `customer.subscription.deleted` | Cancel subscription, downgrade to FREE |
| `invoice.payment_succeeded` | Set status to 'active' |
| `invoice.payment_failed` | Set status to 'past_due' |

---

## Testing

### 1. Test Subscription Creation

```bash
POST /api/subscriptions/create
{
  "tier": "basic",
  "successUrl": "http://localhost:3000/success",
  "cancelUrl": "http://localhost:3000/cancel"
}
```

### 2. Test Feature Gating

```bash
# Try accessing premium feature without subscription
GET /api/courses/premium
# Should return 403 with upgrade message

# After subscribing, should return 200
```

### 3. Test Webhook Events

Use Stripe CLI:
```bash
stripe listen --forward-to localhost:8000/api/subscriptions/webhook

# Trigger test events
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
```

### 4. Test Tier Upgrades

```bash
# Upgrade from Basic to Pro
PUT /api/subscriptions/update
{
  "tier": "pro"
}
```

---

## Best Practices

### 1. Feature Flag Management

- **Centralized Configuration**: All features in `featureFlags.js`
- **Easy to Extend**: Add new features by updating config
- **Type Safety**: Use constants for feature keys

### 2. Subscription Lifecycle

- **Grace Period**: Handle `past_due` status gracefully
- **Downgrade Handling**: Remove premium features on downgrade
- **Trial Periods**: Support trial subscriptions
- **Proration**: Stripe handles proration automatically

### 3. Error Handling

- **Webhook Retries**: Stripe retries failed webhooks
- **Idempotency**: Handle duplicate webhook events
- **Logging**: Log all subscription changes

### 4. Security

- **Webhook Verification**: Always verify Stripe signatures
- **User Authentication**: All endpoints require auth
- **Tier Validation**: Validate tier before updates

### 5. Performance

- **Caching**: Cache subscription data (Redis)
- **Database Indexes**: Index userId, stripeSubscriptionId
- **Async Processing**: Process webhooks asynchronously

---

## Example Usage Scenarios

### Scenario 1: User Upgrades to Pro

1. User clicks "Upgrade to Pro"
2. Frontend calls `POST /api/subscriptions/create` with `tier: "pro"`
3. User redirected to Stripe Checkout
4. User completes payment
5. Stripe sends `customer.subscription.created` webhook
6. Backend updates subscription to Pro tier
7. User immediately gets access to Pro features

### Scenario 2: Feature Gating

1. User tries to access premium course
2. Middleware checks `featureCheck('PREMIUM_COURSES')`
3. If Basic/Pro/Enterprise → Allow access
4. If Free → Return 403 with upgrade prompt

### Scenario 3: Subscription Cancellation

1. User cancels subscription
2. Backend sets `cancelAtPeriodEnd: true`
3. User retains access until period end
4. On period end, Stripe sends `customer.subscription.deleted`
5. Backend downgrades to FREE tier
6. Premium features automatically disabled

---

## Monitoring & Analytics

### Key Metrics to Track

- **MRR (Monthly Recurring Revenue)**: Track by tier
- **Churn Rate**: Monitor cancellations
- **Upgrade Rate**: Track tier upgrades
- **Feature Usage**: Track feature access by tier

### Dashboard Queries

```javascript
// Get subscription statistics
const stats = await subscriptionModel.aggregate([
  {
    $group: {
      _id: '$tier',
      count: { $sum: 1 },
      revenue: { $sum: '$amount' }
    }
  }
]);
```

---

## Troubleshooting

### Issue: Webhook Not Received

**Solution:**
- Check webhook URL in Stripe Dashboard
- Verify webhook secret in `.env`
- Use Stripe CLI for local testing
- Check server logs for errors

### Issue: Feature Not Working After Upgrade

**Solution:**
- Verify webhook was processed
- Check subscription status in database
- Clear any caches
- Verify feature flag configuration

### Issue: Proration Not Working

**Solution:**
- Ensure `proration_behavior: 'always_invoice'` in update
- Check Stripe subscription settings
- Verify price IDs are correct

---

## Next Steps

1. ✅ **Test Integration**: Test all subscription flows
2. ✅ **Configure Stripe Products**: Create products in Stripe Dashboard
3. ✅ **Set Up Webhooks**: Configure webhook endpoint
4. ✅ **Frontend Integration**: Build subscription UI
5. ✅ **Analytics**: Set up subscription tracking
6. ✅ **Email Notifications**: Send subscription emails
7. ✅ **Billing Portal**: Integrate Stripe Customer Portal

---

## Additional Resources

- [Stripe Subscriptions Documentation](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Feature Flag Best Practices](https://launchdarkly.com/blog/feature-flag-best-practices/)

---

**Implementation Status**: ✅ **COMPLETE**

All components are implemented and ready for testing. Follow the setup steps above to configure Stripe products and start accepting subscriptions!

