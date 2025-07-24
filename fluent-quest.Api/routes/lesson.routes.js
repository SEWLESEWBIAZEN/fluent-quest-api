const express =require('express');
const {upload} = require('../middleware/multerMiddleware')
const lessonRoutes = express.Router();

const lessonController = require( '../controllers/lesson.controller')

lessonRoutes.get('/getAll/:courseId', lessonController.getAll);
lessonRoutes.get('/getById/:lessonId', lessonController.getById);
lessonRoutes.post('/create', upload.single('thumbnail'), lessonController.create);
lessonRoutes.put('/update/:lessonId', lessonController.update);
lessonRoutes.delete('/delete/:lessonId', lessonController.delete);


module.exports = lessonRoutes;