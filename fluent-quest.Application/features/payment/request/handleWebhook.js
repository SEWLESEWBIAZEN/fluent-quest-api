const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const paymentModel = require('../../../../fluent-quest.Domain/model/payment.model');
const usersModel = require('../../../../fluent-quest.Domain/model/user.model');
const handleSubscriptionWebhook = require('../../subscription/request/handleSubscriptionWebhook');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

exports.handle = async (event) => {
    try {
        let payment;
        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                payment = await paymentModel.findOne({
                    stripeSessionId: session.id,
                });

                if (payment) {
                    payment.status = 'succeeded';
                    await payment.save();

                    // Enroll user in courses
                    const user = await usersModel.findById(payment.userId);
                    if (user) {
                        const courseIdsToAdd = payment.courseIds.length > 0 
                            ? payment.courseIds 
                            : [payment.courseId].filter(Boolean);

                        // Add courses to enrolledCourses if not already enrolled
                        const newCourses = courseIdsToAdd.filter(
                            (courseId) => !user.enrolledCourses.includes(courseId)
                        );
                        
                        if (newCourses.length > 0) {
                            user.enrolledCourses.push(...newCourses);
                            await user.save();
                        }
                    }
                }
                break;

            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                payment = await paymentModel.findOne({
                    stripePaymentIntentId: paymentIntent.id,
                });

                if (payment && payment.status !== 'succeeded') {
                    payment.status = 'succeeded';
                    await payment.save();

                    // Enroll user in courses
                    const user = await usersModel.findById(payment.userId);
                    if (user) {
                        const courseIdsToAdd = payment.courseIds.length > 0 
                            ? payment.courseIds 
                            : [payment.courseId].filter(Boolean);

                        const newCourses = courseIdsToAdd.filter(
                            (courseId) => !user.enrolledCourses.includes(courseId)
                        );
                        
                        if (newCourses.length > 0) {
                            user.enrolledCourses.push(...newCourses);
                            await user.save();
                        }
                    }
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPaymentIntent = event.data.object;
                payment = await paymentModel.findOne({
                    stripePaymentIntentId: failedPaymentIntent.id,
                });

                if (payment) {
                    payment.status = 'failed';
                    await payment.save();
                }
                break;

            case 'charge.refunded':
                const charge = event.data.object;
                payment = await paymentModel.findOne({
                    stripePaymentIntentId: charge.payment_intent,
                });

                if (payment) {
                    payment.status = 'refunded';
                    await payment.save();

                    // Remove courses from enrolledCourses
                    const user = await usersModel.findById(payment.userId);
                    if (user) {
                        const courseIdsToRemove = payment.courseIds.length > 0 
                            ? payment.courseIds 
                            : [payment.courseId].filter(Boolean);

                        user.enrolledCourses = user.enrolledCourses.filter(
                            (courseId) => !courseIdsToRemove.includes(courseId.toString())
                        );
                        await user.save();
                    }
                }
                break;

            default:
                // Check if it's a subscription event and delegate to subscription webhook handler
                if (event.type.startsWith('customer.subscription.') || 
                    event.type.startsWith('invoice.')) {
                    await handleSubscriptionWebhook.handle(event);
                }
                break;
        }

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Webhook handled successfully',
            data: null,
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to handle webhook',
            data: null,
        });
    }
};

