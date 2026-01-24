const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User ID is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'courses',
      required: false, // Optional for bulk purchases
    },
    courseIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'courses',
      required: false, // For bulk purchases
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeSessionId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'usd',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded'],
      default: 'pending',
      required: true,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ status: 1 });

const paymentModel = mongoose.model('payments', paymentSchema);
module.exports = paymentModel;

