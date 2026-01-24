const lessonsModel = require('../../../../fluent-quest.Domain/model/lesson.model');
const validateCreate = require('../../../../fluent-quest.Application/validations/lesson/validateCreate');
const { createResponse } = require("../../../../fluent-quest.Services/utils/responseHelper");
const { supabase } = require("../../../../fluent-quest.Services/external-services/supabase")
const redisClient = require('../../../../fluent-quest.Services/dependency-manager/redisClient');
exports.create = async (reqData, thumbnail) => {

    // destructure the request data to get the user details
    const { title, course_id, description, type, duration, point } = reqData;

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
        const filePath = `lessonthumbnails/${course_id}_${Date.now()}-${thumbnail.originalname}`;
        // Upload the file to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('lessonthumbnails') // your bucket name
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
                message: error.message || "Failed to upload lesson thumbnail",
                data: null
            });
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('lessonthumbnails')
            .getPublicUrl(data.path);
     
        const lastLessonOrder = await lessonsModel.findOne()
        .sort({order:-1}) //descending
        .select('order -_id')
        .lean();
        const order = lastLessonOrder.order || 0;
        
        // update the database by creating new user
        // this will create a new user in the database       
        const createdLesson = await lessonsModel.create({
            title: title,
            course_id: course_id,
            type: type,
            description: description,
            duration: duration,
            point: point,
            thumbnail: publicUrlData.publicUrl,
            order: order + 1
        });

        // preparing the payload to return
        // this payload will be used to send the response back to the client
        const payload = {
            title: createdLesson.title,
            course_id: createdLesson.course_id,
            type: createdLesson.type,
            description: createdLesson.description,
            duration: createdLesson.duration,
            order: createdLesson.order,
            point: createdLesson.point,
            thumbnail: createdLesson.thumbnail
        };

        //invalidate the cache for this key 
        await redisClient.delPattern(`GET:/api/lessons/getAll/${createdLesson.course_id}*`);

        // return the response with status code 201 and success message
        // this response will be sent back to the client
        return (createResponse({
            statusCode: 201,
            success: true,
            message: "Lesson added successfully",
            data: payload
        }));
    } catch (error) {
        console.log(error)
        // console.error("Error creating lesson:", error);
        // if there is an error, return 500 error
        return (createResponse({

            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error",
            data: null
        }));
    }
}

