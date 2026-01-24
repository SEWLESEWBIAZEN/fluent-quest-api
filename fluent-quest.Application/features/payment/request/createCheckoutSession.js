const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const productModel = require('../../../../fluent-quest.Domain/model/product.model');
const paymentModel = require('../../../../fluent-quest.Domain/model/payment.model');
const coursesModel = require('../../../../fluent-quest.Domain/model/course.model');
const validateCheckout = require('../../../../fluent-quest.Application/validations/payment/validateCheckout');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

exports.create = async (reqData) => {
    const { userId, courseId, courseIds, successUrl, cancelUrl } = reqData;

    // Validate request data
    const validationResult = await validateCheckout.validate(reqData);
    if (validationResult && !validationResult?.success) {
        return createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message,
            data: null,
        });
    }

    try {
        // Determine if single or bulk purchase
        const isBulk = courseIds && courseIds.length > 0;
        const targetCourseIds = isBulk ? courseIds : [courseId];

        // Get all products for the courses
        const products = await productModel.find({
            courseId: { $in: targetCourseIds },
            active: true,
        });

        if (products.length !== targetCourseIds.length) {
            return createResponse({
                statusCode: 400,
                success: false,
                message: 'One or more courses do not have active products',
                data: null,
            });
        }

        // Build line items for Stripe
        const lineItems = products.map((product) => ({
            price: product.stripePriceId,
            quantity: 1,
        }));

        // Calculate total amount
        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
            metadata: {
                userId: userId.toString(),
                courseIds: JSON.stringify(targetCourseIds),
                isBulk: isBulk.toString(),
            },
            customer_email: reqData.customerEmail, // Optional
        });

        // Create payment record in database
        const payment = await paymentModel.create({
            userId: userId,
            courseId: isBulk ? null : courseId,
            courseIds: isBulk ? targetCourseIds : [],
            stripePaymentIntentId: session.payment_intent || session.id,
            stripeSessionId: session.id,
            amount: totalAmount,
            currency: products[0]?.currency || 'usd',
            status: 'pending',
            metadata: {
                isBulk: isBulk,
                courseCount: targetCourseIds.length,
            },
        });

        const payload = {
            sessionId: session.id,
            url: session.url,
            paymentId: payment._id,
            amount: totalAmount,
            currency: products[0]?.currency || 'usd',
        };

        return createResponse({
            statusCode: 201,
            success: true,
            message: 'Checkout session created successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to create checkout session',
            data: null,
        });
    }
};

