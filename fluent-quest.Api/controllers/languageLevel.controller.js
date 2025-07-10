const createLanguageLevel = require('../../fluent-quest.Application/application/languageLevel/request/createLanguageLevel'); 
const {createResponse} = require('../../fluent-quest.Services/utils/responseHelper')
exports.create = async (req, res) => {
    const result = await createLanguageLevel.create(req.body);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};
