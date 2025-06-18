
const bcrypt = require("bcrypt");
const usersModel = require('../../../model/user/user.model');
const { userTypeOf } = require("../../../utils/userTypeOf");
const validateUserRegisteration = require('../../../validations/user/validateRegister');
exports.register=async (reqData)=> {
     const { username, name, role, email, password, phoneNumber, avatar, streakDays, points, enrolledCourses } = reqData;
     const validationResult = await validateUserRegisteration.validateRegister(reqData);

        if (validationResult && !validationResult?.success) {
            return ({
                statusCode: 400,
                success: false,
                message: validationResult?.message
            });
        }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
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

        return ({
            statusCode: 201,
            success: true,
            message: "User registered successfully!",
        });
    } catch (error) {        
        return ({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
} 

