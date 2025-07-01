const { createResponse } = require("../../../utils/responseHelper")
const {supabase} = require("../../../external-services/supabase")
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

        const fileExt = file.originalname.split('.').pop();
        const filePath = `fluent-quest-users-avatar/${userId}_${Date.now()}.${fileExt}`;
        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase
            .storage
            .from('fluent-quest-users-avatar') // your bucket name
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });
        // Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase
            .storage
            .from('fluent-quest-users-avatar')
            .getPublicUrl(filePath);

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
            data: { avatarUrl: publicUrl }
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