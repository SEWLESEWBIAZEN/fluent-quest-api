const express = require('express')
const {redisCacheMiddleware} = require('../middleware/cacheMiddleware')
const contentController = require('../controllers/content.controller')
const {uploadToLocal} = require('../middleware/localFileStreamMulterMiddleware')

const contentRoutes = express.Router();


contentRoutes.get('/:lessonId/contents',  contentController.getAll);
contentRoutes.get('/contents/:contentId',  contentController.getById);
contentRoutes.post('/content/create', contentController.create);
contentRoutes.put('/content/update/:contentId', contentController.update);
contentRoutes.delete('/content/delete/:contentId', contentController.delete);


//upload file content and return the file path
contentRoutes.post('/uploadFileContent', uploadToLocal.single('image'), contentController.uploadFile);
contentRoutes.post('/uploadFileContent2', uploadToLocal.single('file'), contentController.uploadFile2);
contentRoutes.post('/uploadAudio', uploadToLocal.single('audio'), contentController.uploadAudio);
module.exports = contentRoutes;