
const getAllContents = require('../../fluent-quest.Application/features/content/response/getAll')
const getContent = require('../../fluent-quest.Application/features/content/response/getById')
const { createResponse } = require('../../fluent-quest.Services/utils/responseHelper')

exports.getAll = async (req, res) => {
  const { lessonId } = req.params;
  const result = await getAllContents.getAll(lessonId);
  return res.status(result.statusCode)
    .json(createResponse({
      statusCode: result.statusCode,
      success: result.success,
      message: result.message,
      data: result.data || null
    }));
};
exports.getById = async (req, res) => {
  const { contentId } = req.params;
  const result = await getContent.getById(contentId);
  return res.status(result.statusCode)
    .json(createResponse({
      statusCode: result.statusCode,
      success: result.success,
      message: result.message,
      data: result.data || null
    }));
};

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  const file = req.file;
  return res.status(200).json({
    success: 1,
    file: {
      url: `${process.env.BASE_URL}/contentUploads/${file.filename}`, // Consider serving static files correctly
      filename: file.filename,
      
    },
    stretched: true, // displayed as a stretched image
    message: 'File uploaded successfully'
  });
};
