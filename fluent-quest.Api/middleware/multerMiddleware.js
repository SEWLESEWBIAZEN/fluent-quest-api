const multer = require('multer');

// Store files in memory (as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 1000 MB
  }
 });

module.exports = {
  upload
};
