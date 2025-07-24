 const languageLevelsModel = require('../../../../fluent-quest.Domain/model/languageLevel.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getById =async(id)=>{   
    try {
        const language = await languageLevelsModel.findById(id).select(' -__v'); // Exclude __v from the response
        if (!language) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No language level found!",
                data: []
            });
        }

        // Return the list of language levels
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Language Level retrieved successfully",
            data: language
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve language level!"
        });
    }
}