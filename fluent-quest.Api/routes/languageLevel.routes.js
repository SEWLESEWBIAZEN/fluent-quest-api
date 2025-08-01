const express = require("express");
const {redisCacheMiddleware} = require('../middleware/cacheMiddleware')

const languageLevelController = require("../controllers/languageLevel.controller");
const languageLevelRoutes = express.Router();

languageLevelRoutes.get("/getAll", redisCacheMiddleware(), languageLevelController.getAll);
languageLevelRoutes.get("/getById/:id", redisCacheMiddleware(), languageLevelController.getById);
languageLevelRoutes.post("/create", languageLevelController.create);

module.exports = languageLevelRoutes;
