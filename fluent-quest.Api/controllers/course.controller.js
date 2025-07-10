const createCourse =require('../../fluent-quest.Application/application/course/request/createCourse')
const updateCourse =require('../../fluent-quest.Application/application/course/request/updateCourse')
const {createResponse} =require('../../fluent-quest.Services/utils/responseHelper')

exports.create = async (req, res) => {    
    const result = await createCourse.create(req.body);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.update = async (req, res) => {
    const result = await updateCourse.update(req.body, req.params.id);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};
