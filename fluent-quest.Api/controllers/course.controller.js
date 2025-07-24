const createCourse =require('../../fluent-quest.Application/features/course/request/createCourse')
const updateCourse =require('../../fluent-quest.Application/features/course/request/updateCourse')
const getAllCourses = require('../../fluent-quest.Application/features/course/response/getAll');
const getCourseByInstructor = require('../../fluent-quest.Application/features/course/response/getCourseByInstructor');
const {createResponse} =require('../../fluent-quest.Services/utils/responseHelper')





exports.getAll = async (req, res) => {
    const result = await getAllCourses.getAll();
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};
exports.getCoursesByInstructor = async (req, res) => {
    const { teacherId } = req.params;
    const result = await getCourseByInstructor.getCourses(teacherId);
    return res.status(result.statusCode)
        .json(createResponse({
            statusCode: result.statusCode,
            success: result.success,
            message: result.message,
            data: result.data || null
        }));
};
exports.create = async (req, res) => {
   
    const result = await createCourse.create(req.body, req.file);
    
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
