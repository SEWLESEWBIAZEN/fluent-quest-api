const register = require('../application/user/request/register')

exports.registerUser = async (req, res) => {
   const result = await register.register(req.body);   
   return res.status(result.statusCode).json({
       success: result.success,
       message: result.message
   });
};

