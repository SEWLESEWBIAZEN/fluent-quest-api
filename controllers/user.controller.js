const userRegisteration = require('../application/user/request/registerUser');
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

// Additional user-related controller functions can be added here
// For example, login, get user profile, update user details, etc.

