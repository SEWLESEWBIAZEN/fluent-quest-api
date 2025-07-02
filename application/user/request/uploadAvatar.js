const { createResponse } = require("../../../utils/responseHelper")
const { supabase } = require("../../../external-services/supabase")
const usersModel = require("../../../model/user/user.model")
exports.uploadAvatar = async (id, file) => {
    // Check if the file is provided
    if (!file) {
        return createResponse({
            statusCode: 400,
            success: false,
            message: "No file uploaded",
            data: null
        });
    }

    try {
        const filePath = `usersavatar/${id}_${Date.now()}-${file.originalname}`;
        // Upload the file to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('usersavatar') // your bucket name
            .upload(`${filePath}`, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });
        // Get the public URL of the uploaded file

        if (error) {
            console.error("Error uploading file:", error);
            return createResponse({
                statusCode: 500,
                success: false,
                message: error.message || "Failed to upload file",
                data: null
            });
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('usersavatar')
            .getPublicUrl(data.path);

        // Update the user's avatar URL in the database
        const updatedUser = await usersModel.findByIdAndUpdate(id, { avatar: publicUrlData.publicUrl }, { new: true });

        if (!updatedUser) {
            return createResponse({
                statusCode: 404,
                success: false,
                message: "User not found",
                data: null
            });
        }

        return createResponse({
            statusCode: 200,
            success: true,
            message: "Avatar uploaded successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Error uploading avatar:", error);
        return createResponse({
            statusCode: 500,
            success: false,
            message: error?.message || error?.code || "Internal server error",
            data: null
        });
    }
};  