const express =require('express');
const {upload} = require('../middleware/multerMiddleware')
const courseRoutes = express.Router();

const courseController =require( '../controllers/course.controller')

courseRoutes.post('/create', upload.single('thumbnail'), courseController.create);
courseRoutes.put('/update/:id', courseController.update);


module.exports = courseRoutes;