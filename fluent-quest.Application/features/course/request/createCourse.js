const coursesModel = require('../../../../fluent-quest.Domain/model/course.model');
const validateCreate = require('../../../../fluent-quest.Application/validations/course/validateCreate');
const { createResponse } = require("../../../../fluent-quest.Services/utils/responseHelper");
const { supabase } = require("../../../../fluent-quest.Services/external-services/supabase")

exports.create = async (reqData, thumbnail) => {
    // destructure the request data to get the user details
    const { title, code, description, language_id, language_level, teacherId, duration, price } = reqData;

    // validate all required fields 
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
        // create a file path for the thumbnail
        // this will be used to store the thumbnail in Supabase Storage
        const filePath = `coursethumbnails/${code}_${Date.now()}-${thumbnail.originalname}`;
        // Upload the file to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('coursethumbnails') // your bucket name
            .upload(`${filePath}`, thumbnail.buffer, {
                contentType: thumbnail.mimetype,
                upsert: true
            });

        // Check for errors during upload
        // if there is an error, return 500 error
        if (error) {           
            return createResponse({
                statusCode: 500,
                success: false,
                message: error.message || "Failed to upload thumbnail",
                data: null
            });
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('coursethumbnails')
            .getPublicUrl(data.path);

        // update the database by creating new user
        // this will create a new user in the database       
        const createdCourse = await coursesModel.create({
            title: title,
            code: code,
            description: description,
            language_id: language_id,
            language_level: language_level,
            teacherId: teacherId,
            duration: duration,
            price: price,
            thumbnail: publicUrlData.publicUrl
        });

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            title: createdCourse.title,
            code: createdCourse.code,
            description: createdCourse.description,
            language_id: createdCourse.language_id,
            language_level: createdCourse.language_level,
            teacherId: createdCourse.teacherId,
            duration: createdCourse.duration,
            price: createdCourse.price
        };

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 201,
            success: true,
            message: "Course created successfully",
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

