const { stripe } = require('../../../../fluent-quest.Services/external-services/stripe');
const subscriptionModel = require('../../../../fluent-quest.Domain/model/subscription.model');
const SubscriptionTier = require('../../../../fluent-quest.Domain/enums/subscriptionTier');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');

/**
 * Handle Stripe subscription webhook events
 */
exports.handle = async (event) => {
    try {
        let subscription;

        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                const stripeSubscription = event.data.object;
                const userId = stripeSubscription.metadata?.userId;
                
                if (!userId) {
                    console.warn('Subscription webhook missing userId in metadata');
                    break;
                }

                // Get price details to determine tier
                const priceId = stripeSubscription.items.data[0]?.price?.id;
                const tier = getTierFromPriceId(priceId) || SubscriptionTier.BASIC;

                // Update or create subscription
                subscription = await subscriptionModel.findOneAndUpdate(
                    { userId },
                    {
                        userId,
                        tier,
                        stripeSubscriptionId: stripeSubscription.id,
                        stripeCustomerId: stripeSubscription.customer,
                        stripePriceId: priceId,
                        status: stripeSubscription.status,
                        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                        trialStart: stripeSubscription.trial_start 
                            ? new Date(stripeSubscription.trial_start * 1000) 
                            : null,
                        trialEnd: stripeSubscription.trial_end 
                            ? new Date(stripeSubscription.trial_end * 1000) 
                            : null,
                    },
                    { upsert: true, new: true }
                );
                break;

            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object;
                const deletedUserId = deletedSubscription.metadata?.userId;
                
                if (deletedUserId) {
                    await subscriptionModel.findOneAndUpdate(
                        { userId: deletedUserId },
                        {
                            status: 'canceled',
                            canceledAt: new Date(),
                            tier: SubscriptionTier.FREE, // Downgrade to free
                        }
                    );
                }
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                if (invoice.subscription) {
                    const invoiceSubscription = await stripe.subscriptions.retrieve(invoice.subscription);
                    const invoiceUserId = invoiceSubscription.metadata?.userId;
                    
                    if (invoiceUserId) {
                        await subscriptionModel.findOneAndUpdate(
                            { userId: invoiceUserId },
                            {
                                status: 'active',
                            }
                        );
                    }
                }
                break;

            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                if (failedInvoice.subscription) {
                    const failedSubscription = await stripe.subscriptions.retrieve(failedInvoice.subscription);
                    const failedUserId = failedSubscription.metadata?.userId;
                    
                    if (failedUserId) {
                        await subscriptionModel.findOneAndUpdate(
                            { userId: failedUserId },
                            {
                                status: 'past_due',
                            }
                        );
                    }
                }
                break;

            default:
                // Handle other event types if needed
                break;
        }

        return createResponse({
            statusCode: 200,
            success: true,
            message: 'Subscription webhook handled successfully',
            data: null,
        });
    } catch (error) {
        console.error('Subscription webhook error:', error);
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || 'Failed to handle subscription webhook',
            data: null,
        });
    }
};

/**
 * Helper function to determine tier from Stripe price ID
 * This should match your Stripe Dashboard price IDs
 */
function getTierFromPriceId(priceId) {
    if (!priceId) return null;
    
    // Match price ID with tier based on environment variables
    const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC;
    const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
    const enterprisePriceId = process.env.STRIPE_PRICE_ID_ENTERPRISE;

    if (priceId === basicPriceId) return SubscriptionTier.BASIC;
    if (priceId === proPriceId) return SubscriptionTier.PRO;
    if (priceId === enterprisePriceId) return SubscriptionTier.ENTERPRISE;

    return null;
}

