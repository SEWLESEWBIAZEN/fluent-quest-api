const admin = require('../../fluent-quest.Services/external-services/firebase');
const userModel = require('../../fluent-quest.Domain/model/user.model');
const { createResponse } = require('../../fluent-quest.Services/utils/responseHelper');

exports.authCheck = async (req, res, next) => {
    
    try
    {
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        req.user = firebaseUser;
        next();
    }
    catch (error) { 
        if(error.code === 'auth/argument-error') 
            {
                return res.status(400).json(createResponse({statusCode: 400, success: false, message: 'Invalid authentication token', data: null}));
        }       
                
        return res.status(401).json(createResponse({statusCode: 401, success: false, message: 'Unauthorized', data: null}));
    }
}

exports.adminCheck = async (req, res, next) => {
    try
    {
        const { email } = req.user;
        const adminUser = await userModel.findOne({ email });        
        if (adminUser && adminUser?.role ==='admin') {            
            next();
        } else {            
            return res.status(403).json(createResponse({statusCode: 403, success: false, message: 'You are Forbidden to access the resource, contact the admin about the issue!', data: null}));
        }
    } catch (error) {
        
        return res.status(500).json(createResponse({statusCode: 500, success: false, message: 'Internal server error', data: null}));
    }
}