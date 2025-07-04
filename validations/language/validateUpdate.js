
const languagesModel = require('../../model/language.model');
exports.validate = async (data, id) => {
    try {
        if(!id){
            return ({
                success: false,
                message: "Language ID is required"
            });
        }
        const language = await languagesModel.findById(id);
        if (!language) {
            return ({
                success: false,
                message: "Language not found"
            });
        }

        if (!data?.name && !data?.code && !data?.flag && !data?.description) {
            return ({
                success: false,
                message: "No fields provided for update, what do you wants to update?"
            });
        }   
        
        const languageWithTheSameCode = await languagesModel.findOne({code:data?.code,_id: { $ne: id }})
        if (languageWithTheSameCode) {
            return ({
                success: false,
                message: "Language code already exists"
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

           

