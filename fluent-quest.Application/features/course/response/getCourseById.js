 const coursesModel = require('../../../../fluent-quest.Domain/model/course.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getCourseById =async(courseId)=>{   
    try {
        const course = await coursesModel.findById(courseId).select(' -__v'); // Exclude __v from the response
        if (!course) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No course found!",
                data: []
            });
        }

        // Return the course
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Course retrieved successfully",
            data: course
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve course!"
        });
    }
}