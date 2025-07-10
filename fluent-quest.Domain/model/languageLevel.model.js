
const mongoose = require("mongoose");
const languageLevelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Language-level Name is Required"]
        },
        code: {
            type: String,
            required: [true, "Language-level Code is Required"]
        },
        category: {
            type: String,
            required: [true, "Language-level Category is Required"]
        },
        description: {
            type: String,
            required: false
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: false
        },
    },
    {
        timestamps: true,
    }
);

const languageLevelModel = mongoose.model("languageLevels", languageLevelSchema);
module.exports = languageLevelModel;