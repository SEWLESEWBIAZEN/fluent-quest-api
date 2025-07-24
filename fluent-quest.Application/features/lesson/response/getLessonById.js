 const lessonsModel = require('../../../../fluent-quest.Domain/model/lesson.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getById =async(lessonId)=>{   
    try {
        const lesson = await lessonsModel.findById(lessonId).select(' -__v'); // Exclude __v from the response
        if (!lesson) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No lesson found!",
                data: null
            });
        }

        // Return the lesson
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Lesson retrieved successfully",
            data: lesson
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve lesson!"
        });
    }
}