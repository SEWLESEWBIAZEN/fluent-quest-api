const lessonsModel = require("../../../../fluent-quest.Domain/model/lesson.model")
const {createResponse} = require("../../../../fluent-quest.Services/utils/responseHelper")
const redisClient = require('../../../../fluent-quest.Services/dependency-manager/redisClient');
exports.delete = async (lessonId) => {
    try {
        const deletedLesson = await lessonsModel.findByIdAndDelete(lessonId);
        if (!deletedLesson) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "Lesson not found!"
            });
        }

        //invalidate the cache for this key
        await redisClient.delPattern(`GET:/api/lessons/getAll/${deletedLesson.course_id}*`);
        await redisClient.delPattern(`GET:/api/lessons/getById/${deletedLesson._id}*`);

        return createResponse({
            statusCode: 200,
            success: true,
            message: "Lesson deleted successfully",
            data: deletedLesson
        });
    } catch (error) {       
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to delete lesson!"
        });
    }
}
