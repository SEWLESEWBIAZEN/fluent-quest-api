const express =require('express');
const {upload} = require('../middleware/multerMiddleware')
const courseRoutes = express.Router();
const {redisCacheMiddleware} = require('../middleware/cacheMiddleware')

const courseController =require( '../controllers/course.controller')

courseRoutes.get('/getAll', redisCacheMiddleware(), courseController.getAll);
courseRoutes.get('/getByInstructor/:teacherId', redisCacheMiddleware(), courseController.getCoursesByInstructor);
courseRoutes.get('/getById/:courseId', redisCacheMiddleware(), courseController.getCourseById);
courseRoutes.post('/create', upload.single('thumbnail'), courseController.create);

//Note: The below line allow you to upload multiple files in a single request
// courseRoutes.post('/create', upload.array('files'), courseController.create);

// Note: The above line allows for multiple files and thumbnails to be uploaded in a single request
// courseRoutes.post('/create', upload.fields([{name:'files',maxCount:1000},{name:"thumbnails", maxCount:200}]), courseController.create); //maxCount is optional

courseRoutes.put('/update/:id', courseController.update);
courseRoutes.delete('/delete/:id', courseController.delete);


module.exports = courseRoutes;