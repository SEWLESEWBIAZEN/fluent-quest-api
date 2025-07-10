const coursesModel = require('../../../fluent-quest.Domain/model/course.model');
const usersModel =require( '../../../fluent-quest.Domain/model/user.model')
const languagesModel =require( '../../../fluent-quest.Domain/model/language.model')
const languageLevelsModel =require( '../../../fluent-quest.Domain/model/languageLevel.model')
exports.validate = async (data) => {
    try {
        if (!data?.title) {
            return ({
                success: false,
                message: "Course Title is required"
            });
        }

        if (!data?.code) {
            return ({
                success: false,
                message: "Course Code is required"
            });
        }

        if (!data?.description) {
            return ({
                success: false,
                message: "Course Description is required"
            });
        }

        if(!data?.language_id){
            return ({
                success: false,
                message: "Course Language is required"
            });
        }

        if(!data?.language_level){
            return ({
                success: false,
                message: "Course Language Level is required"
            });
        }
        if(!data?.teacherId){
            return ({
                success: false,
                message: "Course Teacher is required"
            });
        }
        if(!data?.duration){
            return ({
                success: false,
                message: "Course Duration is required"
            });
        }

        const getDuplicateCode = await coursesModel.findOne({
            code: data?.code,
        });

        if (getDuplicateCode) {
            return ({
                success: false,
                message: "This language-level code already exists!",
            });
        }

        const getTeacher = await usersModel.findOne({
            _id: data?.teacherId,
        });

        if (!getTeacher) {
            return ({
                success: false,
                message: "Invalid Teacher ID",
            });
        }

        const getLanguage = await languagesModel.findOne({
            _id: data?.language_id,
        });

        if (!getLanguage) {
            return ({
                success: false,
                message: "Invalid Language ID",
            });
        }

        const getLanguageLevel = await languageLevelsModel.findOne({
            _id: data?.language_level,
        });

        if (!getLanguageLevel) {
            return ({
                success: false,
                message: "Invalid Language Level ID",
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

           

