const express =require('express');
const courseRoutes = express.Router();

const courseController =require( '../controllers/course.controller')

courseRoutes.post('/create', courseController.create);
courseRoutes.put('/update/:id', courseController.update);


module.exports = courseRoutes;