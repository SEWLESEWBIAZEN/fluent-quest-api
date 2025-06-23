const usersModel = require('../../../model/user/user.model');
const { userTypeOf } = require("../../../utils/userTypeOf");
const validateUserUpdate = require('../../../validations/user/validateUpdate');
const { createResponse } = require("../../../utils/responseHelper");

exports.update = async (id, reqData) => {
    
    // destructure the request data to get the user details
    const {username, name, role, email, phoneNumber } = reqData;

    // // validate all required fields
    // this will validate the user update request data
    // it will check if the email and phone number are unique
    const validationResult = await validateUserUpdate.validateUpdate(id,reqData);
    if (validationResult && !validationResult?.success) {
        return (createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message,
            data: null
        }));
    }

    try {
        // update the database by updating user details
        // this will update the user details in the database
        // the `new: true` option returns the updated document
        const updatedUser = await usersModel.findByIdAndUpdate(id, {
            username: username,
            role: userTypeOf(role),
            email: email,
            name: name,
            phoneNumber: phoneNumber
        },
            { new: true, runValidators: true }
        );

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            userId: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber
        };

        // if the user is not found, return 404 error
        // otherwise return the updated user details
        if (!updatedUser) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "User not found",
                data: null
            });
        }

        // return the response with status code 200 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 200,
            success: true,
            message: "User updated successfully",
            data: payload
        }));

        
    } catch (error) {
        // if there is an error, return 500 error
        // this error will be sent back to the client
        return (createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error",
            data: null
        }));
    }
}

