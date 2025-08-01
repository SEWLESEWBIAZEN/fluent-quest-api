const createCourse =require('../../fluent-quest.Application/features/course/request/createCourse')
const updateCourse =require('../../fluent-quest.Application/features/course/request/updateCourse')
const deleteCourse =require('../../fluent-quest.Application/features/course/request/deleteCourse')
const getAllCourses = require('../../fluent-quest.Application/features/course/response/getAll');
const getCourseByInstructor = require('../../fluent-quest.Application/features/course/response/getCourseByInstructor');
const getCourseById = require('../../fluent-quest.Application/features/course/response/getCourseById');

exports.getAll = async (req, res) => {
    const result = await getAllCourses.getAll();
    return res.status(result.statusCode).json(result);
};
exports.getCoursesByInstructor = async (req, res) => {
    const { teacherId } = req.params;
    const result = await getCourseByInstructor.getCourses(teacherId);
    return res.status(result.statusCode).json(result);        
};
exports.getCourseById = async (req, res) => {
    const { courseId } = req.params;
    const result = await getCourseById.getCourseById(courseId);
    return res.status(result.statusCode).json(result);
};
exports.create = async (req, res) => {
    const result = await createCourse.create(req.body, req.file);
    return res.status(result.statusCode).json(result);            
};

exports.update = async (req, res) => {
    const result = await updateCourse.update(req.body, req.params.id);
    return res.status(result.statusCode).json(result);       
};
exports.delete = async (req, res) => {
    const result = await deleteCourse.delete(req.params.id);
    return res.status(result.statusCode).json(result);
};
           

