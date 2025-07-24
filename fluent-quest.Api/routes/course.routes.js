const express =require('express');
const {upload} = require('../middleware/multerMiddleware')
const courseRoutes = express.Router();

const courseController =require( '../controllers/course.controller')

courseRoutes.get('/getAll', courseController.getAll);
courseRoutes.get('/getByInstructor/:teacherId', courseController.getCoursesByInstructor);
courseRoutes.post('/create', upload.single('thumbnail'), courseController.create);
courseRoutes.put('/update/:id', courseController.update);
courseRoutes.delete('/delete/:id', courseController.delete);

module.exports = courseRoutes;