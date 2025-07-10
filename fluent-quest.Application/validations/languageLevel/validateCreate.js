
const languageLevelsModel = require('../../../fluent-quest.Domain/model/languageLevel.model');
exports.validate = async (data) => {
    try {
        if (!data?.name) {
            return ({
                success: false,
                message: "Language-level Name is required"
            });
        }

        if (!data?.code) {
            return ({
                success: false,
                message: "Language-level Code is required"
            });
        }

        if (!data?.category) {
            return ({
                success: false,
                message: "Language-level Category is required"
            });
        }

        const getDuplicateCode = await languageLevelsModel.findOne({
            code: data?.code,
        });

        if (getDuplicateCode) {
            return ({
                success: false,
                message: "This language-level code already exists!",
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

           

