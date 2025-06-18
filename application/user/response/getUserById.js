 const usersModel = require('../../../model/user/user.model');
const { createResponse } = require('../../../utils/responseHelper');
exports.getUserById = async (userId) => {
    try {
        const user = await usersModel.findById(userId).select('-password'); // Exclude password from the response
        // Check if user exists
        if (!user) {
            return createResponse({ 
                statusCode: 404,
                success: false,
                message: "No user found!"
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
                message: "Invalid user ID format"
            });
        }
        return createResponse({
            statusCode: 500,
            success: false,
            message: "Internal Server Error, Failed to retrieve user!"
        });
    }
}