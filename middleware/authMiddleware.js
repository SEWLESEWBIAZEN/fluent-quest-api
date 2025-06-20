const admin = require('../firebase/firebase');
const userModel = require('../model/user/user.model');
const { createResponse } = require('../utils/responseHelper');

exports.authCheck = async (req, res, next) => {
    try
    {
        console.log(req.headers.authtoken);
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        console.log("FIREBASE USER :", firebaseUser);
        req.user = firebaseUser;
        next();

    }
    catch (error) {
        console.error('Error in authCheck middleware:', error);
        return createResponse({statusCode: 401, success: false, message: 'Unauthorized', data: null});
    }
}


exports.adminCheck = async (req, res, next) => {
    try
    {
        const { email } = req.user;
        const adminUser = await userModel.findOne({ email });
        if (adminUser && adminUser.role === 'admin') {
            next();
        } else {
            return createResponse({statusCode: 403, success: false, message: 'Forbidden', data: null});
        }
    } catch (error) {
        console.error('Error in adminCheck middleware:', error);
        return createResponse({statusCode: 500, success: false, message: 'Internal server error', data: null});
    }
}