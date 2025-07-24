const languageLevelsModel = require('../../../../fluent-quest.Domain/model/languageLevel.model');
const validateCreate= require('../../../../fluent-quest.Application/validations/languageLevel/validateCreate');
const { createResponse } = require("../../../../fluent-quest.Services/utils/responseHelper");

exports.create = async (reqData) => {
    // destructure the request data to get the user details
    const { name, code, category, description } = reqData;

    // validate all required fields
    // this will validate the user registration request data
    const validationResult = await validateCreate.validate(reqData);
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
        const createdLanguageLevel = await languageLevelsModel.create({
            name: name,
            code: code,
            category: category,
            description: description
        });

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            name: createdLanguageLevel.name,
            code: createdLanguageLevel.code,
            category: createdLanguageLevel.category,
            description: createdLanguageLevel.description
        };
        
        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 201,
            success: true,
            message: "Language-level created successfully",
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

