const coursesModel = require("../../../../fluent-quest.Domain/model/course.model")
const {createResponse} = require("../../../../fluent-quest.Services/utils/responseHelper")
const redisClient = require('../../../../fluent-quest.Services/dependency-manager/redisClient');

exports.delete = async (courseId) => {
    try {
        const deletedCourse = await coursesModel.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "Course not found!"
            });
        }
            //invalidate the cache for this key
    await redisClient.delPattern(`GET:/api/courses/getAll*`);    
    await redisClient.delPattern(`GET:/api/courses/getByInstructor/${deletedCourse.teacherId}*`);
    await redisClient.delPattern(`GET:/api/courses/getById/${courseId}*`);
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Course deleted successfully",
            data: deletedCourse
        });
    } catch (error) {       
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to delete course!"
        });
    }
}
