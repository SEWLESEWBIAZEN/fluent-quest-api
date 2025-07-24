const createLanguage = require('../../fluent-quest.Application/features/language/request/createLanguage');
const getAllLanguages = require('../../fluent-quest.Application/features/language/response/getAll');
const getLanguageById = require('../../fluent-quest.Application/features/language/response/getById')
const getLanguageByCode = require('../../fluent-quest.Application/features/language/response/getByCode') 
const updateLanguage = require('../../fluent-quest.Application/features/language/request/updateLanguage');
const deleteLanguage = require('../../fluent-quest.Application/features/language/request/deleteLanguage');
const {createResponse} = require('../../fluent-quest.Services/utils/responseHelper')



exports.getLanguages = async (req, res) => {
    const result = await getAllLanguages.getAll();
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result?.data || []
        }));
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    const result = await getLanguageById.get(id);   
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.getByCode = async (req, res) => {
    const { code } = req.params;
    const result = await getLanguageByCode.get(code);    
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

exports.delete = async (req, res) => {
    const { id } = req.params;
    const result = await deleteLanguage.delete(id);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};