const createLanguageLevel = require('../../fluent-quest.Application/features/languageLevel/request/createLanguageLevel'); 
const getAllLanguageLevels = require('../../fluent-quest.Application/features/languageLevel/response/getAll');
const getLanguageLevelById = require('../../fluent-quest.Application/features/languageLevel/response/getById');
const {createResponse} = require('../../fluent-quest.Services/utils/responseHelper')
exports.getAll = async (req, res) => {
    const result = await getAllLanguageLevels.getAll();
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || []
        }));
};
exports.getById = async (req, res) => {
    const result = await getLanguageLevelById.getById(req.params.id);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};



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
