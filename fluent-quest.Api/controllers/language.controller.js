const createLanguage = require('../../fluent-quest.Application/features/language/request/createLanguage');
const getAllLanguages = require('../../fluent-quest.Application/features/language/response/getAll');
const getLanguageById = require('../../fluent-quest.Application/features/language/response/getById')
const getLanguageByCode = require('../../fluent-quest.Application/features/language/response/getByCode') 
const updateLanguage = require('../../fluent-quest.Application/features/language/request/updateLanguage');
const deleteLanguage = require('../../fluent-quest.Application/features/language/request/deleteLanguage');
exports.getLanguages = async (req, res) => {
    const result = await getAllLanguages.getAll();
    return res.status(result.statusCode).json(result);
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    const result = await getLanguageById.get(id);
    return res.status(result.statusCode).json(result);
};

exports.getByCode = async (req, res) => {
    const { code } = req.params;
    const result = await getLanguageByCode.get(code);    
    return res.status(result.statusCode).json(result);
};

exports.create = async (req, res) => {
    const result = await createLanguage.create(req.body);
    return res.status(result.statusCode).json(result);
};

exports.update = async (req, res) => {
    const result = await updateLanguage.update(req.body, req.params.id);
    return res.status(result.statusCode).json(result);
};       

exports.delete = async (req, res) => {
    const { id } = req.params;
    const result = await deleteLanguage.delete(id);
    return res.status(result.statusCode).json(result);       
};