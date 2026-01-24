const lessonsModel = require('../../../../fluent-quest.Domain/model/lesson.model');
const validateUpdate = require('../../../../fluent-quest.Application/validations/lesson/validateUpdate');
const { createResponse } = require("../../../../fluent-quest.Services/utils/responseHelper");
const redisClient = require('../../../../fluent-quest.Services/dependency-manager/redisClient');
exports.update = async (reqData, lessonId) => {
    // destructure the request data to get the user details
    const { title, course_id, description, type, duration, order, point } = reqData;

    // validate all required fields 
    const validationResult = await validateUpdate.validate(reqData, lessonId);
    if (validationResult && !validationResult?.success) {
        return (createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message,
            data: null
        }));
    }
    try {
        // update the database by creating new user
        // this will create a new user in the database       
        const updatedLesson = await lessonsModel.findOneAndUpdate({
            _id: lessonId
        }, {
            title: title,
            course_id: course_id,
            description: description,
            type: type,
            duration: duration,
            order: order,
            point: point
        },
        { new: true, runValidators: true }
    );

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            title: updatedLesson.title,
            course_id: updatedLesson.course_id,
            description: updatedLesson.description,
            type: updatedLesson.type,
            duration: updatedLesson.duration,
            order: updatedLesson.order,
            point: updatedLesson.point,
            thumbnail: updatedLesson.thumbnail
        };
        
        //invalidate the cache for this key
        await redisClient.delPattern(`GET:/api/lessons/getAll/${deletedLesson.course_id}*`);
        await redisClient.delPattern(`GET:/api/lessons/getById/${deletedLesson._id}*`);

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 200,
            success: true,
            message: "Lesson updated successfully",
            data: payload
        }));
    } catch (error) {
        // if there is an error, return 500 error
        return (createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error",
            data: null
        }));
    }
}

