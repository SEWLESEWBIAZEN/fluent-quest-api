const contentsModel = require('../../../../fluent-quest.Domain/model/content.model');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getById = async (contentId) => {
    try {
        const content = await contentsModel.findById(contentId).select(' -__v'); // Exclude __v from the response
        if (!content) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No content found!",
                data: [],
            });
        }

        return createResponse({
            statusCode: 200,
            success: true,
            message: "Content retrieved successfully",
            data: content,
        });

    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve content!"
        });
    }
}