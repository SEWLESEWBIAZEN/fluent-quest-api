const coursesModel = require('../../../fluent-quest.Domain/model/course.model');
const lessonsModel = require('../../../fluent-quest.Domain/model/lesson.model');
exports.validate = async (data) => {
    try {

        const duplicateLesson = await lessonsModel.findOne({
            course_id: data?.course_id,
            order: data?.order,
            type: data?.type
        });

        if (duplicateLesson) {
            return ({
                success: false,
                message: "Lesson with the same order already exists in this course"
            })
        }

        if (!data?.title) {
            return ({
                success: false,
                message: "Course Title is required"
            });
        }

        if (!data?.content) {
            return ({
                success: false,
                message: "Course Content is required"
            });
        }

        if (!data?.course_id) {
            return ({
                success: false,
                message: "Course is required"
            });
        }

        if (!data?.order) {
            return ({
                success: false,
                message: "Course Order is required"
            });
        }

        if (!data?.duration) {
            return ({
                success: false,
                message: "Course Duration is required"
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



