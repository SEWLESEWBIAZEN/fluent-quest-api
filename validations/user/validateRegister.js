
const usersModel = require('../../model/user/user.model');
async function validateRegister(data) {
    if (!data.name) {
        return ({
            success: false,
            message: "Name is required"
        });
    }

    if (!data.email) {
        return ({
            success: false,
            message: "Email is required"
        });
    }

    if (!data.password) {
        return ({
            success: false,
            message: "Password must be at least 5 characters long."
        });
    }

    if (!data.username) {
        return ({
            success: false,
            message: "User Name is required"
        });
    }

    if (data.password !== data.confirm_password) {
        return ({
            success: false,
            message: "Password and confirmed password doesnot match!"
        });
    }

    const getDuplicateEmail = await usersModel.findOne({
        email: data.email,
    });

    if (getDuplicateEmail) {
        return ({
            success: false,
            message: "This email already exists!",
        });
    }
    return undefined; // No validation errors 
}

module.exports = { validateRegister };