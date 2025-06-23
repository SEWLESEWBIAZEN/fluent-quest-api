const usersModel = require('../../../model/user/user.model');
const { userTypeOf } = require("../../../utils/userTypeOf");
const validateUserRegisteration = require('../../../validations/user/validateRegister');
const { createResponse } = require("../../../utils/responseHelper");

exports.register = async (reqData) => {
    // destructure the request data to get the user details
    const { username, name, role, email, phoneNumber, avatar, streakDays, points, enrolledCourses } = reqData;

    // validate all required fields
    // this will validate the user registration request data
    const validationResult = await validateUserRegisteration.validateRegister(reqData);
    if (validationResult && !validationResult?.success) {
        return (createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message,
            data: null
        }));
    }

    try {
        // update the database by creating new user
        // this will create a new user in the database       
        const createdUser = await usersModel.create({
            username: username,
            role: userTypeOf(role),
            email: email,
            name: name,
            phoneNumber: phoneNumber,
            avatar: avatar || "",
            streakDays: streakDays || 0,
            points: points || 0,
            enrolledCourses: enrolledCourses || [],
        },
            { new: true, runValidators: true }
        );

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            userId: createdUser._id,
            username: createdUser.username,
            email: createdUser.email,
            role: createdUser.role,
            name: createdUser.name,
            phoneNumber: createdUser.phoneNumber
        };

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: payload
        }));
    } catch (error) {
        // if there is an error, return 500 error
        return (createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error",
            data: null
        }));
    }
}

