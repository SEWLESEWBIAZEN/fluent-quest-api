 const languagesModel = require('../../../model/language.model');
 const { createResponse } = require('../../../utils/responseHelper');
exports.get =async(code)=>{   
    try {
        const language = await languagesModel.findOne({ code: code }).select(' -__v'); // Exclude __v from the response
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

       