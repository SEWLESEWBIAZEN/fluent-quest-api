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

contentSchema.index({ lessonId: 1, order: 1 }, { unique: true }); // Ensure unique order per lesson
const contentsModel = mongoose.model("contents", contentSchema);
module.exports = contentsModel;
