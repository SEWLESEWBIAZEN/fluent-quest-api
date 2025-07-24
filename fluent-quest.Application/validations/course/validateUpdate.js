const coursesModel = require('../../../fluent-quest.Domain/model/course.model');
const usersModel =require( '../../../fluent-quest.Domain/model/user.model')
const languagesModel =require( '../../../fluent-quest.Domain/model/language.model')
const languageLevelsModel =require( '../../../fluent-quest.Domain/model/languageLevel.model')
exports.validate = async (data, id) => {
    try {
        if(!id){
            return ({
                success: false,
                message: "Course ID is required"
            });
        }
        const course = await coursesModel.findById(id);
        if (!course) {
            return ({
                success: false,
                message: "Course not found"
            });
        }

       

        if (!data?.title && !data?.code && !data?.language_id && !data?.description && !data?.language_level && !data?.teacherId && !data?.duration) {
            return ({
                success: false,
                message: "No fields provided for update, what do you wants to update?"
            });
        }        

        if(data?.teacherId){
            const getTeacher = await usersModel.findOne({
                _id: data?.teacherId,
            });
    
            if (!getTeacher) {
                return ({
                    success: false,
                    message: "Invalid Teacher ID",
                });
            }
        }

        if(data?.language_id){
            const getLanguage = await languagesModel.findOne({
                _id: data?.language_id,
            });

            if (!getLanguage) {
                return ({
                    success: false,
                    message: "Invalid Language ID",
                });
            }
        }

        if(data?.language_level){
            const getLanguageLevel = await languageLevelsModel.findOne({
                _id: data?.language_level,
            });

            if (!getLanguageLevel) {
                return ({
                    success: false,
                    message: "Invalid Language Level ID",
                });
            }
        }

        if(data?.code){
            const courseWithTheSameCode = await coursesModel.findOne({code:data?.code, _id: { $ne: id }})
            if (courseWithTheSameCode) {
                return ({
                    success: false,
                    message: "Course code already exists"
                });
            }
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

           

