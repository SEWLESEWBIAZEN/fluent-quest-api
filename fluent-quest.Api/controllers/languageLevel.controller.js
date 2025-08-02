const createLanguageLevel = require('../../fluent-quest.Application/features/languageLevel/request/createLanguageLevel'); 
const getAllLanguageLevels = require('../../fluent-quest.Application/features/languageLevel/response/getAll');
const getLanguageLevelById = require('../../fluent-quest.Application/features/languageLevel/response/getById');
exports.getAll = async (req, res) => {
    const result = await getAllLanguageLevels.getAll();
    return res.status(result.statusCode).json(result);
};
exports.getById = async (req, res) => {
    const result = await getLanguageLevelById.getById(req.params.id);
    return res.status(result.statusCode).json(result);
};

exports.create = async (req, res) => {
    const result = await createLanguageLevel.create(req.body);
    return res.status(result.statusCode).json(result);
};
