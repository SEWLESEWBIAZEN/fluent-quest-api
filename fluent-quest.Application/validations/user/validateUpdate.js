const usersModel = require('../../../fluent-quest.Domain/model/user.model');
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
            return ({
                success: false,
                message: "This email already exists!",
            });
        }
        if (getDuplicatePhone) {
            return ({
                success: false,
                message: "This phone number already exists!",
            });
        }
        return ({
            success: true,
            message: "Validation successful, no errors found.",
        }); // No validation errors
    } catch (error) {
        return ({
            success: false,
            message: error?.message || "Internal Server Error, Validation failed!",
        });
    }
};

