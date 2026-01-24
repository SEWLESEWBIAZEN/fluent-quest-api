const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const productModel = require('../../../../fluent-quest.Domain/model/product.model');
const coursesModel = require('../../../../fluent-quest.Domain/model/course.model');
const validateUpdatePrice = require('../../../../fluent-quest.Application/validations/payment/validateUpdatePrice');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

exports.update = async (reqData) => {
    const { courseId, price, currency = 'usd' } = reqData;

    // Validate request data
    const validationResult = await validateUpdatePrice.validate(reqData);
    if (validationResult && !validationResult?.success) {
        return createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message,
            data: null,
        });
    }

    try {
        // Get existing product
        const product = await productModel.findOne({ courseId: courseId });
        if (!product) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: 'Product not found for this course',
                data: null,
            });
        }

        // Archive old price in Stripe
        await stripe.prices.update(product.stripePriceId, {
            active: false,
        });

        // Create new price in Stripe
        const newStripePrice = await stripe.prices.create({
            product: product.stripeProductId,
            unit_amount: Math.round(price * 100), // Convert to cents
            currency: currency.toLowerCase(),
            metadata: {
                courseId: courseId.toString(),
            },
        });

        // Update product in database
        const updatedProduct = await productModel.findOneAndUpdate(
            { courseId: courseId },
            {
                stripePriceId: newStripePrice.id,
                price: price,
                currency: currency.toLowerCase(),
            },
            { new: true }
        );

        // Update course price
        await coursesModel.findByIdAndUpdate(courseId, { price: price });

        const payload = {
            productId: updatedProduct._id,
            courseId: updatedProduct.courseId,
            stripeProductId: updatedProduct.stripeProductId,
            stripePriceId: updatedProduct.stripePriceId,
            price: updatedProduct.price,
            currency: updatedProduct.currency,
            active: updatedProduct.active,
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Price updated successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to update price',
            data: null,
        });
    }
};

