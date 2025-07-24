const mongoose = require("mongoose");
const lessonsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required!"],
        },
        content: {
            type: String,
            required: [true, "Content is required!"]
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'courses',
            required: [true, "Course is required!"]
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
            default: 1
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

const lessonsModel = mongoose.model("lessons", lessonsSchema);
module.exports = lessonsModel;