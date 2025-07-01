const userRegisteration = require('../application/user/request/registerUser');
const userUpdate = require('../application/user/request/updateUser');
const uploadAvatar = require('../application/user/request/uploadAvatar');
const getAllUsers = require('../application/user/response/getAllUsers');
const getUserById = require('../application/user/response/getUserById');
const getUserByEmail = require('../application/user/response/getUserByEmail');
const { createResponse } = require('../utils/responseHelper');

exports.getUsers = async (req, res) => {
    const result = await getAllUsers.getAllUsers();

    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.getUser = async (req, res) => {    
    const result = await getUserById.getUserById(req.params.id);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.getUserByEmail = async (req, res) => {
   
    const result = await getUserByEmail.getUserByEmail(req.params.email);
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


exports.updateUser = async (req, res) => {    
    const result = await userUpdate.update(req.params.id, req.body);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
}

exports.uploadAvatar = async (req, res) => {
const result = await uploadAvatar.uploadAvatar(req.params.id, req.file);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
}