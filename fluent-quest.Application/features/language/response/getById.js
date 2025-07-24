 const languagesModel = require('../../../../fluent-quest.Domain/model/language.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.get =async(id)=>{   
    try {
        const language = await languagesModel.findById(id).select(' -__v'); // Exclude __v from the response
        if (!language) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No language found!"
            });
        }

        // Return the language
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Language retrieved successfully",
            data: language
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve languages!"
        });
    }
}