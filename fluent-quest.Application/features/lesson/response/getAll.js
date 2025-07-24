 const lessonsModel = require('../../../../fluent-quest.Domain/model/lesson.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getAll =async(courseId)=>{   
    try {
        const lessons = await lessonsModel.find({ course_id: courseId }).select(' -__v'); // Exclude __v from the response
        if (!lessons || lessons.length === 0) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No lessons found!",
                data: []
            });
        }

        // Return the list of lessons
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Lessons retrieved successfully",
            data: lessons
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve lessons!"
        });
    }
}