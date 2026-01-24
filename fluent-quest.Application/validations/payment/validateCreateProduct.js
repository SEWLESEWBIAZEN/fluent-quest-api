const coursesModel = require('../../../fluent-quest.Domain/model/course.model');
const productModel = require('../../../fluent-quest.Domain/model/product.model');

exports.validate = async (data) => {
    try {
        if (!data?.courseId) {
            return {
                success: false,
                message: 'Course ID is required',
            };
        }

        if (!data?.price && data?.price !== 0) {
            return {
                success: false,
                message: 'Price is required',
            };
        }

        if (typeof data.price !== 'number' || data.price < 0) {
            return {
                success: false,
                message: 'Price must be a non-negative number',
            };
        }

        // Validate course exists
        const course = await coursesModel.findById(data.courseId);
        if (!course) {
            return {
                success: false,
                message: 'Invalid Course ID',
            };
        }

        // Check if product already exists
        const existingProduct = await productModel.findOne({ courseId: data.courseId });
        if (existingProduct) {
            return {
                success: false,
                message: 'Product already exists for this course. Use update price endpoint instead.',
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

