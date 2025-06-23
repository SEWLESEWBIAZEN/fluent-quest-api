const admin = require('../firebase/firebase');
const userModel = require('../model/user/user.model');
const { createResponse } = require('../utils/responseHelper');

exports.authCheck = async (req, res, next) => {
    try
    {
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);      
        req.user = firebaseUser;
        next();
    }
    catch (error) {        
        return res.status(401).json(createResponse({statusCode: 401, success: false, message: 'Unauthorized', data: null}));
    }
}

exports.adminCheck = async (req, res, next) => {
    try
    {
        const { email } = req.user;
        const adminUser = await userModel.findOne({ email });        
        if (adminUser && adminUser?.role?.find(r=>r.toLowerCase() ==='admin')) {            
            next();
        } else {            
            return res.status(403).json(createResponse({statusCode: 403, success: false, message: 'You are Forbidden to access the resource, contact the admin about the issue!', data: null}));
        }
    } catch (error) {
        
        return res.status(500).json(createResponse({statusCode: 500, success: false, message: 'Internal server error', data: null}));
    }
}