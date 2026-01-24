const paymentModel = require('../../../../fluent-quest.Domain/model/payment.model');
const productModel = require('../../../../fluent-quest.Domain/model/product.model');
const coursesModel = require('../../../../fluent-quest.Domain/model/course.model');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

exports.getDashboard = async (filters = {}) => {
    try {
        const { userId, startDate, endDate, status } = filters;

        // Build query
        const query = {};
        if (userId) query.userId = userId;
        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get payments
        const payments = await paymentModel
            .find(query)
            .populate('userId', 'name email username')
            .populate('courseId', 'title code')
            .populate('courseIds', 'title code')
            .sort({ createdAt: -1 })
            .limit(100);

        // Calculate statistics
        const totalPayments = await paymentModel.countDocuments(query);
        const successfulPayments = await paymentModel.countDocuments({
            ...query,
            status: 'succeeded',
        });
        const totalRevenue = await paymentModel.aggregate([
            { $match: { ...query, status: 'succeeded' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const revenueByStatus = await paymentModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    total: { $sum: '$amount' },
                },
            },
        ]);

        const recentPayments = await paymentModel
            .find(query)
            .populate('userId', 'name email')
            .populate('courseId', 'title')
            .sort({ createdAt: -1 })
            .limit(10);

        const payload = {
            statistics: {
                totalPayments,
                successfulPayments,
                failedPayments: totalPayments - successfulPayments,
                totalRevenue: totalRevenue[0]?.total || 0,
                revenueByStatus: revenueByStatus.reduce((acc, item) => {
                    acc[item._id] = {
                        count: item.count,
                        total: item.total,
                    };
                    return acc;
                }, {}),
            },
            recentPayments: recentPayments.map((payment) => ({
                id: payment._id,
                userId: payment.userId,
                courseId: payment.courseId,
                courseIds: payment.courseIds,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                createdAt: payment.createdAt,
            })),
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
        };

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Dashboard data retrieved successfully',
            data: payload,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to retrieve dashboard data',
            data: null,
        });
    }
};

