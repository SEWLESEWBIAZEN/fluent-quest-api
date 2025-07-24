const coursesModel = require('../../../fluent-quest.Domain/model/course.model');
const lessonsModel = require('../../../fluent-quest.Domain/model/lesson.model');
exports.validate = async (data, lessonId) => {
    try {
        if (!lessonId)
            return ({
                success: false,
                message: "Lesson ID is required"
            });
        const lesson = await lessonsModel.findById(lessonId);

        if (!lesson) {
            return ({
                success: false,
                message: "Invalid Lesson ID"
            });
        }

        const duplicateLesson = await lessonsModel.findOne({
            _id: { $ne: lessonId },
            course_id: data?.course_id,
            order: data?.order
        });

        if (duplicateLesson) {
            return ({
                success: false,
                message: "Lesson with the same order already exists in this course"
            })
        }

        if (!data?.title && !data?.content && !data?.course_id && !data?.order && !data?.duration) {
            return ({
                success: false,
                message: "Lesson Title is required"
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



