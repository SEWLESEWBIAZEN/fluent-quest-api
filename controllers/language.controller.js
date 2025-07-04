const createLanguage = require('../application/language/request/createLanguage');
const getAllLanguages = require('../application/language/response/getAll');
const getLanguage = require('../application/language/response/getById')
const updateLanguage = require('../application/language/request/updateLanguage');
const {createResponse} = require('../utils/responseHelper')


exports.getLanguageById = async (req, res) => {
    const { id } = req.params;
    const result = await getLanguage.getById(id);
    if (!result) {
        return res.status(404).json(createResponse({
            statusCode: 404,
            success: false,
            message: "Language not found",
            data: null
        }));
    }
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};
exports.getLanguages = async (req, res) => {
    const result = await getAllLanguages.getAll();
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

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

exports.update = async (req, res) => {
    const result = await updateLanguage.update(req.body, req.params.id);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};