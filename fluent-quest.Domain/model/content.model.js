const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'embed', 'code'],
      default: 'text',
      required: [true, "Content type is required"],
    },
    value: {
      type: String,
      required: [true, "Actual content is required"], // HTML string, URL, or embed code
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      unique: [true, "Order must be unique"],
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

const contentsModel = mongoose.model("contents", contentSchema);
module.exports = contentsModel;
