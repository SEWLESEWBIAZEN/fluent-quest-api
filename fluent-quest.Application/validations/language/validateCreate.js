
const languagesModel = require('../../../fluent-quest.Domain/model/language.model');
exports.validate = async (data) => {
    try {
        if (!data?.name) {
            return ({
                success: false,
                message: "Language Name is required"
            });
        }

        if (!data?.code) {
            return ({
                success: false,
                message: "Language Code is required"
            });
        }

        if (!data?.flag) {
            return ({
                success: false,
                message: "Language Flag is required"
            });
        }

        const getDuplicateCode = await languagesModel.findOne({
            code: data?.code,
        });

        if (getDuplicateCode) {
            return ({
                success: false,
                message: "This language code already exists!",
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

           

