const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const productModel = require('../../../../fluent-quest.Domain/model/product.model');
const coursesModel = require('../../../../fluent-quest.Domain/model/course.model');
const validateCreateProduct = require('../../../../fluent-quest.Application/validations/payment/validateCreateProduct');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

exports.create = async (reqData) => {
    const { courseId, price, currency = 'usd' } = reqData;

    // Validate request data
    const validationResult = await validateCreateProduct.validate(reqData);
    if (validationResult && !validationResult?.success) {
        return createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message,
            data: null,
        });
    }

    try {
        // Get course details
        const course = await coursesModel.findById(courseId);
        if (!course) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: 'Course not found',
                data: null,
            });
        }

        // Create product in Stripe
        const stripeProduct = await stripe.products.create({
            name: course.title,
            description: course.description || `Course: ${course.title}`,
            metadata: {
                courseId: courseId.toString(),
            },
        });

        // Create price in Stripe
        const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(price * 100), // Convert to cents
            currency: currency.toLowerCase(),
            metadata: {
                courseId: courseId.toString(),
            },
        });

        // Save product to database
        const product = await productModel.create({
            courseId: courseId,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
            price: price,
            currency: currency.toLowerCase(),
            active: true,
        });

        // Update course price
        await coursesModel.findByIdAndUpdate(courseId, { price: price });

        const payload = {
            productId: product._id,
            courseId: product.courseId,
            stripeProductId: product.stripeProductId,
            stripePriceId: product.stripePriceId,
            price: product.price,
            currency: product.currency,
            active: product.active,
        };

        return createResponse({
            statusCode: 201,
            success: true,
            message: 'Product created successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to create product',
            data: null,
        });
    }
};

