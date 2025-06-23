
const usersModel = require('../../model/user/user.model');
const { createResponse } = require('../../utils/responseHelper');
exports.validateUpdate = async (id, data) => {
    try {
        const getDuplicateEmail = await usersModel.findOne({
            email: data?.email,
            _id: { $ne: id } // Exclude the current user ID from the check
        });
        const getDuplicatePhone = await usersModel.findOne({
            phoneNumber: data?.phoneNumber,
            _id: { $ne: id } // Exclude the current user ID from the check
        });

        if (getDuplicateEmail) {
            return createResponse({
                statusCode: 400,
                success: false,
                message: "This email already exists!",
                data: null
            });
        }
        if (getDuplicatePhone) {
            return createResponse({
                statusCode: 400,
                success: false,
                message: "This phone number already exists!",
                data: null
            });
        }
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Validation successful, no errors found.",
            data: null
        }); // No validation errors
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error?.message || "Internal Server Error, Validation failed!",
            data: null
        });
    }
};

