 const usersModel = require('../../../../fluent-quest.Domain/model/user.model');
const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getUserById = async (userId) => {
    try {
        const user = await usersModel.findById(userId).select(' -__v -userId'); // Exclude userId and __v from the response      
        // Check if user exists
        if (!user) {
            return createResponse({ 
                statusCode: 404,
                success: false,
                message: "No user found!",
                data: null
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
                message: "Invalid user ID format",
                data : null
            });
        }
        return createResponse({
            statusCode: 500,
            success: false,
            message: "Internal Server Error, Failed to retrieve user!",
            data : null
        });
    }
}