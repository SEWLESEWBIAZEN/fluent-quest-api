const coursesModel = require('../../../fluent-quest.Domain/model/course.model');
exports.validate = async (data) => {
    try {
        if (!data?.title) {
            return ({
                success: false,
                message: "Lesson Title is required"
            });
        }

        if (!data?.course_id) {
            return ({
                success: false,
                message: "Lesson is required"
            });
        }

        if (!data?.duration) {
            return ({
                success: false,
                message: "Lesson Duration is required"
            });
        }

        const getCourse = await coursesModel.findOne({
            _id: data?.course_id,
        });

        if (!getCourse) {
            return ({
                success: false,
                message: "Invalid Course ID",
            });
        }

        return ({
            success: true,
            message: "Validation successful"
        }); // No validation errors
    } catch (error) {
        return {
            success: false,
            message: error?.message || "Internal Server Error, Validation failed!",
        };
    }
};



