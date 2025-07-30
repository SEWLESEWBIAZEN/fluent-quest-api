const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../public/contentUploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, fileName);
  }
});

const uploadToLocal = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 10 MB limit (adjust if needed)
  fileFilter: (req, file, cb) => {
    // Optionally filter by file type
    cb(null, true);
  }
});

module.exports = { uploadToLocal };
