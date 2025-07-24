 const coursesModel = require('../../../../fluent-quest.Domain/model/course.model');
 const { createResponse } = require('../../../../fluent-quest.Services/utils/responseHelper');
exports.getAll =async()=>{   
    try {
        const courses = await coursesModel.find({}).select(' -__v'); // Exclude __v from the response
        if (!courses || courses.length === 0) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "No courses found!",
                data: []
            });
        }

        // Return the list of courses
        return createResponse({
            statusCode: 200,
            success: true,
            message: "Courses retrieved successfully",
            data: courses
        });
    } catch (error) {
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to retrieve courses!"
        });
    }
}