const userRegisteration = require('../application/user/request/registerUser');
const getAllUsers = require('../application/user/response/getAllUsers');
const getUserById = require('../application/user/response/getUserById');
const { createResponse } = require('../utils/responseHelper');

exports.registerUser = async (req, res) => {
    const result = await userRegisteration.register(req.body);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.getUsers= async (req, res) => {  
    const result = await getAllUsers.getAllUsers();    
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};


exports.getUser= async (req, res) => {   
    const result = await getUserById.getUserById(req.params.id);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};
// Additional user-related controller functions can be added here
// For example, login, get user profile, update user details, etc.

