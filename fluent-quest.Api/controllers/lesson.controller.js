const getAllLessons = require('../../fluent-quest.Application/features/lesson/response/getAll');
const getLessonById = require('../../fluent-quest.Application/features/lesson/response/getLessonById');
const createLesson = require('../../fluent-quest.Application/features/lesson/request/createLesson')
const updateLesson = require('../../fluent-quest.Application/features/lesson/request/updateLesson')
const deleteLesson = require('../../fluent-quest.Application/features/lesson/request/deleteLesson')
const {createResponse}  = require('../../fluent-quest.Services/utils/responseHelper')

exports.getAll = async (req, res) => {
    const { courseId } = req.params;
    const result = await getAllLessons.getAll(courseId);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};
exports.getById = async (req, res) => {
    const { lessonId } = req.params;
    const result = await getLessonById.getById(lessonId);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.create = async (req, res) => {   
    const result = await createLesson.create(req.body, req.file);    
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.update = async (req, res) => {   
    const { lessonId } = req.params;
    const result = await updateLesson.update(req.body, lessonId);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};

exports.delete = async (req, res) => {
    const { lessonId } = req.params;
    const result = await deleteLesson.delete(lessonId);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};