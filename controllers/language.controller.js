const createLanguage = require('../application/language/request/createLanguage');
const {createResponse} = require('../utils/responseHelper')
exports.create = async (req, res) => {
    const result = await createLanguage.create(req.body);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};