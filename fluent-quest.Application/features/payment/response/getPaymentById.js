const paymentModel = require('../../../../fluent-quest.Domain/model/payment.model');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

exports.getById = async (paymentId) => {
    try {
        const payment = await paymentModel
            .findById(paymentId)
            .populate('userId', 'name email username')
            .populate('courseId', 'title code price description')
            .populate('courseIds', 'title code price description');

        if (!payment) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: 'Payment not found',
                data: null,
            });
        }

        const payload = {
            id: payment._id,
            userId: payment.userId,
            courseId: payment.courseId,
            courseIds: payment.courseIds,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            stripePaymentIntentId: payment.stripePaymentIntentId,
            stripeSessionId: payment.stripeSessionId,
            paymentMethod: payment.paymentMethod,
            metadata: payment.metadata,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Payment retrieved successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to retrieve payment',
            data: null,
        });
    }
};

