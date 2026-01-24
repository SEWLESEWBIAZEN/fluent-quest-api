const coursesModel = require('../../../fluent-quest.Domain/model/course.model');
const usersModel = require('../../../fluent-quest.Domain/model/user.model');

exports.validate = async (data) => {
    try {
        if (!data?.userId) {
            return {
                success: false,
                message: 'User ID is required',
            };
        }

        // Validate user exists
        const user = await usersModel.findById(data.userId);
        if (!user) {
            return {
                success: false,
                message: 'Invalid User ID',
            };
        }

        // Single item checkout validation
        if (data.courseId && !data.courseIds) {
            const course = await coursesModel.findById(data.courseId);
            if (!course) {
                return {
                    success: false,
                    message: 'Invalid Course ID',
                };
            }
        }

        // Bulk checkout validation
        if (data.courseIds && Array.isArray(data.courseIds)) {
            if (data.courseIds.length === 0) {
                return {
                    success: false,
                    message: 'At least one course ID is required for bulk checkout',
                };
            }

            // Check if all courses exist
            const courses = await coursesModel.find({ _id: { $in: data.courseIds } });
            if (courses.length !== data.courseIds.length) {
                return {
                    success: false,
                    message: 'One or more Course IDs are invalid',
                };
            }
        }

        // Must have either courseId or courseIds
        if (!data.courseId && !data.courseIds) {
            return {
                success: false,
                message: 'Either courseId (single) or courseIds (bulk) is required',
            };
        }

        return {
            success: true,
            message: 'Validation successful',
        };
    } catch (error) {
        return {
            success: false,
            message: error?.message || 'Internal Server Error, Validation failed!',
        };
    }
};

