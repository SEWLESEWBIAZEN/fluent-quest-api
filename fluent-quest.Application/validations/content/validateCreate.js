const lessonsModel = require('../../../fluent-quest.Domain/model/lesson.model');
const contentsModel = require('../../../fluent-quest.Domain/model/content.model');
exports.validate = async (data,order) => {
    try {

        if (!data?.lessonId) {
            return ({
                success: false,
                message: "Lesson ID is required"
            });
        }

        const getLesson = await lessonsModel.findOne({
            _id: data?.lessonId,
        });
        if (!getLesson) {
            return ({
                success: false,
                message: "Invalid Lesson ID",
            });
        }

        const duplicateContent = await contentsModel.findOne({
            lessonId: data?.lessonId,
            order: order
        });

        if (duplicateContent) {
            return ({
                success: false,
                message: "Content with the same order already exists in this lesson"
            })
        }

        if (!data?.value) {
            return ({
                success: false,
                message: "Actual Content is required"
            });
        }

        if (!order) {
            return ({
                success: false,
                message: "Course Order is required"
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



