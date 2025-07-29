const contentsModel = require('../../../../fluent-quest.Domain/model/content.model')
const {createResponse} = require('../../../../fluent-quest.Services/utils/responseHelper')

exports.delete = async(contentId)=>{
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