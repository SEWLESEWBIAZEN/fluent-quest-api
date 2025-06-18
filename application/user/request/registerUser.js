const bcrypt = require("bcrypt");
const usersModel = require('../../../model/user/user.model');
const { userTypeOf } = require("../../../utils/userTypeOf");
const validateUserRegisteration = require('../../../validations/user/validateRegister');
const { createResponse } = require("../../../utils/responseHelper");

exports.register = async (reqData) => {
    const { username, name, role, email, password, phoneNumber, avatar, streakDays, points, enrolledCourses } = reqData;
    // validate all required fields
    const validationResult = await validateUserRegisteration.validateRegister(reqData);
    if (validationResult && !validationResult?.success) {
        return (createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message
        }));
    }

    try {
        // hash the password before saving to the db
        const hashedPassword = await bcrypt.hash(password, 12);
        // update the database by creating new user
        const createdUser = await usersModel.create({
            username: username,
            role: userTypeOf(role),
            email: email,
            name: name,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            avatar: avatar || "",
            streakDays: streakDays || 0,
            points: points || 0,
            enrolledCourses: enrolledCourses || [],
        });

        const payload = {
            userId: createdUser._id,
            username: createdUser.username,
            email: createdUser.email,
            role: createdUser.role,
            name: createdUser.name,
            phoneNumber: createdUser.phoneNumber
        };

        return (createResponse({
            statusCode: 201,
            success: true,
            message: "User registered successfully",
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

