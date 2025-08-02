const userRegisteration = require('../../fluent-quest.Application/features/user/request/registerUser');
const userUpdate = require('../../fluent-quest.Application/features/user/request/updateUser');
const uploadAvatar = require('../../fluent-quest.Application/features/user/request/uploadAvatar');
const deleteUser =require( '../../fluent-quest.Application/features/user/request/deleteUser');
const getAllUsers = require('../../fluent-quest.Application/features/user/response/getAllUsers');
const getAllTeachers = require('../../fluent-quest.Application/features/user/response/getAllTeachers');
const {getUserById} = require('../../fluent-quest.Application/features/user/response/getUserById');
const getUserByEmail = require('../../fluent-quest.Application/features/user/response/getUserByEmail');
const { createResponse } = require('../../fluent-quest.Services/utils/responseHelper');

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
exports.getTeachers = async (req, res) => {
    const result = await getAllTeachers.getAllTeachers();

    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.getUser = async (req, res) => {
    const result = await getUserById(req.params.id);   
    return res.status(result.statusCode).json(result);
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
exports.deleteUser = async (req, res) => {
    const result = await deleteUser.delete(req.query.dbid, req.query.fbid);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
}