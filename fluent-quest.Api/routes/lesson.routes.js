const express =require('express');
const {upload} = require('../middleware/multerMiddleware')
const lessonRoutes = express.Router();
const contentRoutes = require('./content.routes')
const {redisCacheMiddleware} = require('../middleware/cacheMiddleware')
const lessonController = require( '../controllers/lesson.controller')

lessonRoutes.get('/getAll/:courseId', redisCacheMiddleware(), lessonController.getAll);
lessonRoutes.get('/getById/:lessonId', redisCacheMiddleware(), lessonController.getById);
lessonRoutes.post('/create', upload.single('thumbnail'), lessonController.create);
lessonRoutes.put('/update/:lessonId', lessonController.update);
lessonRoutes.delete('/delete/:lessonId', lessonController.delete);

//content routes
lessonRoutes.use('/lesson', contentRoutes);

module.exports = lessonRoutes;