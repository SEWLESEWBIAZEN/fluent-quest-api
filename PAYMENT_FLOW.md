# Payment Flow Documentation

## Complete Payment Flow: Client Request to Success/Error Response

### Flow Diagram

```
┌─────────────┐
│   CLIENT    │
└──────┬──────┘
       │
       │ 1. POST /api/payments/checkout
       │    { userId, courseId/courseIds, successUrl, cancelUrl }
       ▼
┌─────────────────────────────────────┐
│  Express Middleware Stack           │
│  - CORS                              │
│  - Raw body parser (webhook only)    │
│  - JSON parser (skip webhook)        │
│  - Auth middleware (skip webhook)    │
└──────┬──────────────────────────────┘
       │
       │ 2. Authentication Check
       ▼
┌─────────────────────────────────────┐
│  Payment Controller                  │
│  - createCheckout()                  │
└──────┬──────────────────────────────┘
       │
       │ 3. Validation
       ▼
┌─────────────────────────────────────┐
│  validateCheckout.validate()         │
│  ✓ User exists                       │
│  ✓ Course(s) exist                   │
│  ✓ Valid request structure           │
└──────┬──────────────────────────────┘
       │
       │ 4. Create Stripe Session
       ▼
┌─────────────────────────────────────┐
│  createCheckoutSession.create()      │
│  - Fetch products from DB            │
│  - Build line items                 │
│  - Create Stripe Checkout Session    │
│  - Create payment record (pending)   │
└──────┬──────────────────────────────┘
       │
       │ 5. Return Session URL
       ▼
┌─────────────┐
│   CLIENT    │
│ Redirect to │
│ Stripe URL  │
└──────┬──────┘
       │
       │ 6. User enters card on Stripe
       │    (Card data NEVER touches your server)
       ▼
┌─────────────────────────────────────┐
│         STRIPE PROCESSES             │
│         PAYMENT SECURELY             │
└──────┬──────────────────────────────┘
       │
       │ 7. Stripe sends webhook
       ▼
┌─────────────────────────────────────┐
│  POST /api/payments/webhook          │
│  - Raw body preserved                │
│  - No JSON parsing                   │
└──────┬──────────────────────────────┘
       │
       │ 8. Signature Verification
       ▼
┌─────────────────────────────────────┐
│  stripe.webhooks.constructEvent()   │
│  - Verifies stripe-signature header │
│  - Uses STRIPE_WEBHOOK_SECRET        │
│  - Returns event object              │
└──────┬──────────────────────────────┘
       │
       │ 9. Handle Webhook Event
       ▼
┌─────────────────────────────────────┐
│  handleWebhook.handle(event)        │
│                                      │
│  Event Types:                        │
│  • checkout.session.completed        │
│  • payment_intent.succeeded          │
│  • payment_intent.payment_failed     │
│  • charge.refunded                   │
└──────┬──────────────────────────────┘
       │
       │ 10. Update Database
       ▼
┌─────────────────────────────────────┐
│  Database Updates:                  │
│  - Payment status → 'succeeded'      │
│  - User enrolledCourses updated      │
└──────┬──────────────────────────────┘
       │
       │ 11. Response
       ▼
┌─────────────┐
│   CLIENT    │
│ Success URL │
│ or Error    │
└─────────────┘
```

## Security Features

### 1. Card Information Security
- **Never stored on your server**
- **Never transmitted to your server**
- Handled entirely by Stripe's PCI-compliant infrastructure
- Client redirects to Stripe-hosted checkout page

### 2. Webhook Signature Verification
```javascript
// Location: payment.controller.js:37
event = stripe.webhooks.constructEvent(
    req.body,           // Raw body (Buffer)
    sig,                // stripe-signature header
    webhookSecret       // STRIPE_WEBHOOK_SECRET env var
);
```

**Why it's critical:**
- Prevents malicious webhook requests
- Ensures webhook is from Stripe
- Validates payload integrity
- Must use raw body (not parsed JSON)

### 3. Raw Body Handling
```javascript
// Location: inject-express.js:28
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
```

**Why:**
- Stripe signature is calculated from raw request body
- JSON parsing modifies the body, breaking signature verification
- Raw body middleware must be before JSON parser

## Error Handling

### Validation Errors (400)
- Missing userId
- Invalid course ID(s)
- User doesn't exist
- Course doesn't exist

### Signature Verification Errors (400)
- Invalid signature
- Missing stripe-signature header
- Wrong webhook secret

### Processing Errors (500)
- Database connection issues
- Stripe API errors
- Unexpected exceptions

### Payment Failures
- Card declined → `payment_intent.payment_failed` event
- Payment status set to `'failed'`
- User not enrolled

## Success Flow

1. Payment succeeds → `checkout.session.completed` event
2. Payment record updated → status: `'succeeded'`
3. User enrolled in course(s)
4. Client redirected to success URL
5. Client can verify via `/api/payments/payments/:paymentId`

## Key Files

- **Routes**: `fluent-quest.Api/routes/payment.routes.js`
- **Controller**: `fluent-quest.Api/controllers/payment.controller.js`
- **Checkout Logic**: `fluent-quest.Application/features/payment/request/createCheckoutSession.js`
- **Webhook Handler**: `fluent-quest.Application/features/payment/request/handleWebhook.js`
- **Validation**: `fluent-quest.Application/validations/payment/validateCheckout.js`
- **Raw Body Setup**: `fluent-quest.Services/dependency-manager/inject-express.js`

