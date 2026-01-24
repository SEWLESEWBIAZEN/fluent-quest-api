const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'courses',
      required: [true, 'Course ID is required'],
      unique: true,
    },
    stripeProductId: {
      type: String,
      required: true,
      unique: true,
    },
    stripePriceId: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'usd',
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
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

// Indexes
productSchema.index({ courseId: 1 });
productSchema.index({ stripeProductId: 1 });
productSchema.index({ active: 1 });

const productModel = mongoose.model('products', productSchema);
module.exports = productModel;

