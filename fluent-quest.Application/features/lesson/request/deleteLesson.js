const lessonsModel = require("../../../../fluent-quest.Domain/model/lesson.model")
const {createResponse} = require("../../../../fluent-quest.Services/utils/responseHelper")

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
