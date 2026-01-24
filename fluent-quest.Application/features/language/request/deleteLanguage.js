const languagesModel = require( '../../../../fluent-quest.Domain/model/language.model')
const {createResponse} = require ('../../../../fluent-quest.Services/utils/responseHelper')
const redisClient = require('../../../../fluent-quest.Services/dependency-manager/redisClient');

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

        //invalidate the cache for this key
        await redisClient.delPattern(`GET:/api/languages/getAll*`);   
        await redisClient.delPattern(`GET:/api/languages/getById/${id}*`);   

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