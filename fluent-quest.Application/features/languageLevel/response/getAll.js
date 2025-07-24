 const languageLevelsModel = require('../../../../fluent-quest.Domain/model/languageLevel.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getAll =async()=>{   
    try {
        const languages = await languageLevelsModel.find({}).select(' -__v'); // Exclude __v from the response
        if (!languages || languages.length === 0) {
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
            message: "Language Levels retrieved successfully",
            data: languages
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve language levels!"
        });
    }
}