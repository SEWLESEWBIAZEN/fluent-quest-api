const bcrypt = require("bcrypt");
const usersModel = require('../../model/user/user.model');
const { userTypeOf } = require("../../utils/userTypeOf");
const validateUserRegisteration = require('../../validations/user/validateRegister');

const register = async (req, res) => {
    const { username, name, role, email, password, phoneNumber, avatar, streakDays, points, enrolledCourses } = req.body;

  const validationResult = await validateUserRegisteration.validateRegister(req.body);

        if (validationResult && !validationResult?.success) {
            return res.status(400).json({
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

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = register;