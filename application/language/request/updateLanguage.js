const languagesModel = require('../../../model/language.model');
const validateUpdate = require('../../../validations/language/validateUpdate');
const { createResponse } = require("../../../utils/responseHelper");

exports.update = async (reqData, id) => {
    // destructure the request data to get the user details
    const { name, code, flag, description } = reqData;

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
        const createdLanguage = await languagesModel.findOneAndUpdate({
            _id: id
        }, {
            name: name,
            code: code,
            flag: flag,
            description: description
        }, { new: true, runValidators: true });

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            name: createdLanguage.name,
            code: createdLanguage.code,
            flag: createdLanguage.flag,
            description: createdLanguage.description
        };

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 200,
            success: true,
            message: "Language updated successfully",
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

