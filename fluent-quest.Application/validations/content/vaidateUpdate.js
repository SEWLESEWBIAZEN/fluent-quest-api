const lessonsModel = require('../../../fluent-quest.Domain/model/lesson.model');
const contentsModel = require('../../../fluent-quest.Domain/model/content.model');
exports.validate = async (data, contentId) => {
    try {

        if(!contentId) {
            return ({
                success: false,
                message: "Content ID is required"
            });
        }

        const getContent = await contentsModel.findOne({
            _id: contentId,            
        });

        if (!getContent) {
            return ({
                success: false,
                message: "Invalid Content ID",
            });
        }

        const duplicateContent = await contentsModel.findOne({
            _id: { $ne: contentId },
            lessonId: data?.lessonId,
            order: data?.order
        });

        if (duplicateContent) {
            return ({
                success: false,
                message: "Content with the same order already exists in this lesson"
            })
        }


        if (!data?.value && !data?.order && !data?.type) {
            return ({
                success: false,
                message: "No fields provided for update, what do you want to update?"
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



