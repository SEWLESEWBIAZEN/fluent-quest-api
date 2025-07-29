const contentsModel = require('../../../../fluent-quest.Domain/model/content.model');
const validateUpdate = require('../../../../fluent-quest.Application/validations/content/validateUpdate')
const { createResponse } = require("../../../../fluent-quest.Services/utils/responseHelper");

exports.update = async (reqData,contentId) => {
    // destructure the request data to get the user details
    const { type, value } = reqData;

    // validate all required fields
    // this will validate the user registration request data
    const validationResult = await validateUpdate.validate(reqData, contentId);
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
        const updatedContent = await contentsModel.findByIdAndUpdate(contentId, {
            type: type,
            value: value
        }, { new: true, runValidators: true });


        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            lessonId: updatedContent.lessonId,
            type: updatedContent.type,
            value: updatedContent.value,
            order: updatedContent.order
        };

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 200,
            success: true,
            message: "Content updated successfully",
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

