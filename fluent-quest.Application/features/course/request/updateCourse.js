const coursesModel = require( '../../../../fluent-quest.Domain/model/course.model');
const validateUpdate = require( '../../../../fluent-quest.Application/validations/course/validateUpdate');
const { createResponse } = require( "../../../../fluent-quest.Services/utils/responseHelper");

exports.update = async (reqData, id) => {
 // destructure the request data to get the user details
    const { title, code, description, language_id, language_level, teacherId, duration, price, thumbnail } = reqData;

    // validate all required fields
    // this will validate the user registration request data
    const validationResult = await validateUpdate.validate(reqData, id);
    if (validationResult && !validationResult?.success) {
        return (createResponse({
            statusCode: 400,
            success: false,
            message: validationResult?.message || "Invalid data sent from user",
            data: null
        }));
    }
    try {
        // update the database by creating new user
        // this will create a new user in the database       
        const updatedCourse = await coursesModel.findOneAndUpdate({
            _id: id
        }, {
            title: title,
            code: code,
            description: description,
            language_id: language_id,
            language_level: language_level,
            teacherId: teacherId,
            duration: duration,
            price: price,
            thumbnail: thumbnail
        }, { new: true, runValidators: true });

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            title: updatedCourse.title,
            code: updatedCourse.code,
            description: updatedCourse.description,
            language_id: updatedCourse.language_id,
            language_level: updatedCourse.language_level,
            teacherId: updatedCourse.teacherId,
            duration: updatedCourse.duration,
            price: updatedCourse.price,
            thumbnail: updatedCourse.thumbnail
        };

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 200,
            success: true,
            message: "Course updated successfully",
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

