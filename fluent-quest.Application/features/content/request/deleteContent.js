const contentsModel = require('../../../../fluent-quest.Domain/model/content.model')
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper')
const redisClient = require('../../../../fluent-quest.Services/dependency-manager/redisClient');
exports.delete = async (contentId) => {
    if (!contentId) {
        return createResponse({
            statusCode: 400,
            success: false,
            message: "Content ID is required",
            data: null
        });
    }
    try {
        const deletedContent = await contentsModel.findByIdAndDelete(contentId);
        if (!deletedContent) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "Content not found",
                data: null
            });
        }

    //invalidate the cache for this key
    await redisClient.delPattern(`GET:/api/lessons/lesson/${deletedContent.lessonId}/contents*`);
    //invalidate the getbyid
    await redisClient.delPattern(`GET:/api/lessons/lesson/contents/${contentId}`);

        return createResponse({
            statusCode: 200,
            success: true,
            message: "Content deleted successfully",
            data: null
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error",
            data: null
        });
    }
}