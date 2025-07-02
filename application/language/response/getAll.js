 const languagesModel = require('../../../model/language.model');
 const { createResponse } = require('../../../utils/responseHelper');
exports.getAll =async()=>{   
    try {
        const languages = await languagesModel.find({}).select(' -__v'); // Exclude __v from the response
        if (!languages || languages.length === 0) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No languages found!"
            });
        }

        // Return the list of languages
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Languages retrieved successfully",
            data: languages
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve languages!"
        });
    }
}