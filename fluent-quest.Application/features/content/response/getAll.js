const contentsModel = require('../../../../fluent-quest.Domain/model/content.model');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getAll = async (lessonId) => {
    try {
        const contents = await contentsModel.find({ lesson_id: lessonId }).select(' -__v'); // Exclude __v from the response
        if (!contents || contents.length === 0) {
            return createResponse({
                statusCode: contents ? 200 : 404,
                success: contents ? true : false,
                message: "No contents found!",
                data: [],
            });
        }

        return createResponse({
            statusCode: 200,
            success: true,
            message: "Contents retrieved successfully",
            data: contents,
        });

    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve contents!"
        });
    }
}