const usersModel = require('../../../model/user/user.model');
const { userTypeOf } = require("../../../utils/userTypeOf");
const validateUserUpdate = require('../../../validations/user/validateUpdate');
const { createResponse } = require("../../../utils/responseHelper");

exports.update = async (id, reqData) => {
    const {username, name, role, email, phoneNumber } = reqData;
    // // validate all required fields
    const validationResult = await validateUserUpdate.validateUpdate(id,reqData);
    if (validationResult && !validationResult?.success) {
        return (createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message
        }));
    }

    try {
        // update the database by updating user details
        const updatedUser = await usersModel.findByIdAndUpdate(id, {
            username: username,
            role: userTypeOf(role),
            email: email,
            name: name,
            phoneNumber: phoneNumber
        },
            { new: true, runValidators: true }
        );

        const payload = {
            userId: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber
        };

        if (!updatedUser) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "User not found",
                data: null
            });
        }

        return (createResponse({
            statusCode: 200,
            success: true,
            message: "User updated successfully",
            data: payload
        }));
    } catch (error) {
        return (createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error",
        }));
    }
}

