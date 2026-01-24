const createProduct = require('../../fluent-quest.Application/features/payment/request/createProduct');
const updatePrice = require('../../fluent-quest.Application/features/payment/request/updatePrice');
const createCheckoutSession = require('../../fluent-quest.Application/features/payment/request/createCheckoutSession');
const handleWebhook = require('../../fluent-quest.Application/features/payment/request/handleWebhook');
const getDashboard = require('../../fluent-quest.Application/features/payment/response/getDashboard');
const getPayments = require('../../fluent-quest.Application/features/payment/response/getPayments');
const getPaymentById = require('../../fluent-quest.Application/features/payment/response/getPaymentById');
const { stripe } = require('../../fluent-quest.Services/external-services/stripe');

// Create product for a course
exports.createProduct = async (req, res) => {
    const result = await createProduct.create(req.body);
    return res.status(result.statusCode).json(result);
};

// Update price for a course
exports.updatePrice = async (req, res) => {
    const result = await updatePrice.update(req.body);
    return res.status(result.statusCode).json(result);
};

// Create checkout session (single or bulk)
exports.createCheckout = async (req, res) => {
    const result = await createCheckoutSession.create(req.body);
    return res.status(result.statusCode).json(result);
};

// Handle Stripe webhook
exports.webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({
            success: false,
            message: `Webhook Error: ${err.message}`,
        });
    }

    // Handle the webhook event
    const result = await handleWebhook.handle(event);
    
    // Return a response to acknowledge receipt of the event
    res.json({ received: true, result });
};

// Get dashboard data
exports.getDashboard = async (req, res) => {
    const filters = {
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        status: req.query.status,
    };
    const result = await getDashboard.getDashboard(filters);
    return res.status(result.statusCode).json(result);
};

// Get all payments
exports.getPayments = async (req, res) => {
    const filters = {
        userId: req.query.userId,
        status: req.query.status,
        limit: req.query.limit,
        page: req.query.page,
    };
    const result = await getPayments.getAll(filters);
    return res.status(result.statusCode).json(result);
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    const { paymentId } = req.params;
    const result = await getPaymentById.getById(paymentId);
    return res.status(result.statusCode).json(result);
};

