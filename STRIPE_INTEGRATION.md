# Stripe Payment Integration

This document describes the Stripe payment integration for the Fluent Quest API.

## Overview

The Stripe integration is modularized and follows the clean architecture pattern used throughout the application. It includes:

- Product management (create products, update prices)
- Checkout sessions (single and bulk purchases)
- Payment tracking and dashboard
- Webhook handling for payment events
- Automatic course enrollment upon successful payment

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your Stripe webhook signing secret
FRONTEND_URL=http://localhost:3000 # Your frontend URL for redirects
```

### 2. Stripe Dashboard Configuration

1. Go to your Stripe Dashboard
2. Navigate to **Developers > Webhooks**
3. Add a webhook endpoint: `https://your-domain.com/api/payments/webhook`
4. Select the following events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret and add it to your `.env` file

## API Endpoints

### Product Management

#### Create Product for a Course
**POST** `/api/payments/create-product`

Creates a Stripe product and price for a course.

**Request Body:**
```json
{
  "courseId": "course_id_here",
  "price": 29.99,
  "currency": "usd"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Product created successfully",
  "data": {
    "productId": "product_id",
    "courseId": "course_id",
    "stripeProductId": "prod_...",
    "stripePriceId": "price_...",
    "price": 29.99,
    "currency": "usd",
    "active": true
  }
}
```

#### Update Price for a Course
**PUT** `/api/payments/update-price`

Updates the price of an existing product. Creates a new price in Stripe and archives the old one.

**Request Body:**
```json
{
  "courseId": "course_id_here",
  "price": 39.99,
  "currency": "usd"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Price updated successfully",
  "data": {
    "productId": "product_id",
    "courseId": "course_id",
    "stripeProductId": "prod_...",
    "stripePriceId": "price_...",
    "price": 39.99,
    "currency": "usd",
    "active": true
  }
}
```

### Checkout

#### Create Checkout Session (Single Item)
**POST** `/api/payments/checkout`

Creates a Stripe Checkout session for a single course or multiple courses.

**Request Body (Single Item):**
```json
{
  "userId": "user_id_here",
  "courseId": "course_id_here",
  "successUrl": "https://your-frontend.com/success",
  "cancelUrl": "https://your-frontend.com/cancel",
  "customerEmail": "customer@example.com"
}
```

**Request Body (Bulk Items):**
```json
{
  "userId": "user_id_here",
  "courseIds": ["course_id_1", "course_id_2", "course_id_3"],
  "successUrl": "https://your-frontend.com/success",
  "cancelUrl": "https://your-frontend.com/cancel",
  "customerEmail": "customer@example.com"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Checkout session created successfully",
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/...",
    "paymentId": "payment_id",
    "amount": 89.97,
    "currency": "usd"
  }
}
```

**Note:** Redirect the user to the `url` in the response to complete the payment.

### Dashboard & Payments

#### Get Dashboard Data
**GET** `/api/payments/dashboard`

Retrieves payment statistics and recent payments.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter payments from this date (ISO format)
- `endDate` (optional): Filter payments until this date (ISO format)
- `status` (optional): Filter by payment status (`pending`, `succeeded`, `failed`, etc.)

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "statistics": {
      "totalPayments": 150,
      "successfulPayments": 142,
      "failedPayments": 8,
      "totalRevenue": 12500.50,
      "revenueByStatus": {
        "succeeded": {
          "count": 142,
          "total": 12500.50
        },
        "failed": {
          "count": 8,
          "total": 0
        }
      }
    },
    "recentPayments": [...],
    "payments": [...]
  }
}
```

#### Get All Payments
**GET** `/api/payments/payments`

Retrieves a paginated list of payments.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by payment status
- `limit` (optional): Number of items per page (default: 50)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Payments retrieved successfully",
  "data": {
    "payments": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

#### Get Payment by ID
**GET** `/api/payments/payments/:paymentId`

Retrieves details of a specific payment.

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Payment retrieved successfully",
  "data": {
    "id": "payment_id",
    "userId": {...},
    "courseId": {...},
    "courseIds": [...],
    "amount": 29.99,
    "currency": "usd",
    "status": "succeeded",
    "stripePaymentIntentId": "pi_...",
    "stripeSessionId": "cs_...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Webhook

#### Stripe Webhook Endpoint
**POST** `/api/payments/webhook`

This endpoint is called by Stripe when payment events occur. It handles:
- Payment success → Enrolls user in courses
- Payment failure → Updates payment status
- Refunds → Removes courses from user's enrolled courses

**Note:** This endpoint does not require authentication as it's called by Stripe servers. The webhook signature is verified for security.

## Architecture

The Stripe integration follows the clean architecture pattern:

```
fluent-quest.Api/
  └── controllers/
      └── payment.controller.js       # Controller layer
  └── routes/
      └── payment.routes.js            # Route definitions

fluent-quest.Application/
  └── features/
      └── payment/
          ├── request/                 # Command handlers
          │   ├── createProduct.js
          │   ├── updatePrice.js
          │   ├── createCheckoutSession.js
          │   └── handleWebhook.js
          ├── response/                # Query handlers
          │   ├── getDashboard.js
          │   ├── getPayments.js
          │   └── getPaymentById.js
          └── validations/             # Validation logic
              ├── validateCheckout.js
              ├── validateUpdatePrice.js
              └── validateCreateProduct.js

fluent-quest.Domain/
  └── model/
      ├── payment.model.js             # Payment schema
      └── product.model.js             # Product schema

fluent-quest.Services/
  └── external-services/
      └── stripe.js                    # Stripe client initialization
```

## Features

### Automatic Course Enrollment

When a payment succeeds:
1. The webhook handler updates the payment status to `succeeded`
2. The user is automatically enrolled in the purchased course(s)
3. Course IDs are added to the user's `enrolledCourses` array

### Payment Status Tracking

Payments are tracked with the following statuses:
- `pending`: Payment initiated but not completed
- `processing`: Payment is being processed
- `succeeded`: Payment completed successfully
- `failed`: Payment failed
- `canceled`: Payment was canceled
- `refunded`: Payment was refunded

### Bulk Purchases

The system supports purchasing multiple courses in a single transaction:
- Pass an array of `courseIds` instead of a single `courseId`
- All courses are included in one Stripe Checkout session
- User is enrolled in all courses upon successful payment

## Security

- All payment endpoints (except webhook) require authentication via `authCheck` middleware
- Webhook endpoint verifies Stripe signature to ensure requests are from Stripe
- Payment records are stored securely in MongoDB
- Stripe handles all sensitive payment data (PCI compliance)

## Testing

### Test Mode

Use Stripe test mode keys for development:
- Test secret key: `sk_test_...`
- Test webhook secret: `whsec_...`
- Test card numbers: See [Stripe Testing](https://stripe.com/docs/testing)

### Testing Webhooks Locally

Use Stripe CLI to forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:8000/api/payments/webhook
```

This will provide you with a webhook signing secret for local testing.

## Error Handling

All endpoints return standardized responses:
- `success`: Boolean indicating operation success
- `statusCode`: HTTP status code
- `message`: Human-readable message
- `data`: Response data or null on error

## Future Enhancements

Potential improvements:
- Subscription-based payments
- Coupon/discount code support
- Payment method management
- Refund management endpoint
- Email notifications on payment events
- Analytics and reporting enhancements

