const paymentModel = require('../../../../fluent-quest.Domain/model/payment.model');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

exports.getAll = async (filters = {}) => {
    try {
        const { userId, status, limit = 50, page = 1 } = filters;

        // Build query
        const query = {};
        if (userId) query.userId = userId;
        if (status) query.status = status;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get payments with pagination
        const payments = await paymentModel
            .find(query)
            .populate('userId', 'name email username')
            .populate('courseId', 'title code price')
            .populate('courseIds', 'title code price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await paymentModel.countDocuments(query);

        const payload = {
            payments: payments.map((payment) => ({
                id: payment._id,
                userId: payment.userId,
                courseId: payment.courseId,
                courseIds: payment.courseIds,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                stripePaymentIntentId: payment.stripePaymentIntentId,
                stripeSessionId: payment.stripeSessionId,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
            })),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Payments retrieved successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to retrieve payments',
            data: null,
        });
    }
};

