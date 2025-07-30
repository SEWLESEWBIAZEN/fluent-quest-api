const contentsModel = require('../../../../fluent-quest.Domain/model/content.model');
const validateCreate = require('../../../../fluent-quest.Application/validations/content/validateCreate');
const { createResponse } = require("../../../../fluent-quest.Services/utils/responseHelper");
const getNextOrderNumber = require('../../../../fluent-quest.Services/utils/getNextOrder');
exports.create = async (reqData) => {
    // destructure the request data to get the user details
    const { lessonId, type, value } = reqData;
    
    //get the next order number
    const nextOrderNumber = await getNextOrderNumber(lessonId);
    console.log(nextOrderNumber)

    // validate all required fields
    // this will validate the user registration request data
    const validationResult = await validateCreate.validate(reqData, nextOrderNumber);
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
        const createdContent = await contentsModel.create({
            lessonId: lessonId,
            type: type,
            value: value,
            order: nextOrderNumber
        });

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            lessonId: createdContent.lessonId,
            type: createdContent.type,
            value: createdContent.value,
            order: createdContent.order
        };

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 201,
            success: true,
            message: "Content created successfully",
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

