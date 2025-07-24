const coursesModel = require("../../../../fluent-quest.Domain/model/course.model")
const admin = require("../../../../fluent-quest.Services/external-services/firebase")
const {createResponse} = require("../../../../fluent-quest.Services/utils/responseHelper")

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
