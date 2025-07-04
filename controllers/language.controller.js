const createLanguage = require('../application/language/request/createLanguage');
const getAllLanguages = require('../application/language/response/getAll');
const getLanguageById = require('../application/language/response/getById')
const getLanguageByCode = require('../application/language/response/getByCode') 
const updateLanguage = require('../application/language/request/updateLanguage');
const deleteLanguage = require('../application/language/request/deleteLanguage')
const {createResponse} = require('../utils/responseHelper')



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