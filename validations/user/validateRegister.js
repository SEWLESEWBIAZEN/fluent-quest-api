
const usersModel = require('../../model/user.model');
exports.validateRegister = async (data) => {
    try {
        if (!data?.name) {
            return ({
                success: false,
                message: "Name is required"
            });
        }

        if (!data?.email) {
            return ({
                success: false,
                message: "Email is required"
            });
        }
       

        if (!data?.username) {
            return ({
                success: false,
                message: "User Name is required"
            });
        }       

        const getDuplicateEmail = await usersModel.findOne({
            email: data?.email,
        });

        if (getDuplicateEmail) {
            return ({
                success: false,
                message: "This email already exists!",
            });
        }
        const getDuplicatePhone = await usersModel.findOne({
            phoneNumber: data?.phoneNumber,
        });

        if (getDuplicatePhone) {
            return ({
                success: false,
                message: "This PhoneNumber already exists!",
            });
        }

        return ({           
            success: true,
            message: "Validation successful"          
        }); // No validation errors
    } catch (error) {
        return {
            success: false,
            message: error?.message || "Internal Server Error, Validation failed!",
        };
    }
};

