const usersModel = require("../../../../fluent-quest.Domain/model/user.model")
const admin = require("../../../../fluent-quest.Services/external-services/firebase")
const {createResponse} = require("../../../../fluent-quest.Services/utils/responseHelper")

exports.delete = async (dbid, fbid) => {
    try {
        const deletedUser = await usersModel.findByIdAndDelete(dbid);
        await admin.auth().deleteUser(fbid);
        if (!deletedUser) {          
            return createResponse({
                statusCode: 404,
                success: false,
                message: "User not found!"
            });
        }
        return createResponse({
            statusCode: 200,
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (error) {       
        return createResponse({
            statusCode: 500,
            success: false,
            message: error.message || "Internal Server Error, Failed to delete user!"
        });
    }
}
