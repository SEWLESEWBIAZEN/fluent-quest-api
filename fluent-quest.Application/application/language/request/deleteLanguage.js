const languagesModel = require( '../../../../fluent-quest.Domain/model/language.model')
const {createResponse} = require ('../../../../fluent-quest.Services/utils/responseHelper')

exports.delete = async(id)=>{
    try {
        const language = await languagesModel.findByIdAndDelete(id);
        if (!language) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No language found!"
            });
        }

        // Return success response
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Language deleted successfully",
            data: language
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to delete language!"
        });
    }
}