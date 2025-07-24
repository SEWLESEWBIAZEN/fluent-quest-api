 const usersModel = require('../../../../fluent-quest.Domain/model/user.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getAllUsers =async()=>{   
    try {
        const users = await usersModel.find({}).select(' -__v'); // Exclude userId and __v from the response
        if (!users || users.length === 0) {            
            return createResponse( {
                statusCode: 404,
                success: false,
                message: "No users found!"
            });
        }       
        
        // Return the list of users
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve users!"
        });
    }
}