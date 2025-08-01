 const usersModel = require('../../../../fluent-quest.Domain/model/user.model');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getUserByEmail = async (userEmail) => {     
    try {
        const user = await usersModel.findOne({ email: userEmail }).select('-__v -userId'); // Exclude userId and __v from the response
        // Check if user exists       
        if (!user) {
            return createResponse({ 
                statusCode: 404,
                success: false,
                message: "No user found!!"
            });
        }
        return createResponse({
            statusCode: 200,
            success: true,
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        
        if (error.name === 'CastError') {
            return createResponse({
                statusCode: 400,
                success: false,
                message: error
            });
        }
        return createResponse({
            statusCode: 500,
            success: false,
            message: "Internal Server Error, Failed to retrieve user!"
        });
    }
}