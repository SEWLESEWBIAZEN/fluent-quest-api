const mongoose = require("mongoose");
const lessonsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required!"],
        },
        content: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'contents',
            required: false,
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courses',
            required: [true, "Course is required!"]
        },
        description: {
            type: String,
            required: false
        },
        thumbnail: {
            type: String,
            required: false
        },
        duration: {
            type: Number,
            required: [true, "Duration is required!"]
        },
        type: {
            type: String,
            enum: ['video', 'article', 'quiz'],
            required: [true, "Type is required!"]
        },
        point: {
            type: Number,
            default: 0
        },
        order: {
            type: Number,
            default: 1,           
            required: [true, "Lesson Order is required!"]
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            required: false,
        },
    },
    {
        timestamps: true,
    }
);
lessonsSchema.index({ course_id: 1, order: 1 }, { unique: true });
const lessonsModel = mongoose.model("lessons", lessonsSchema);
module.exports = lessonsModel;