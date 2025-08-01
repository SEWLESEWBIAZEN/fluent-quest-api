const express = require("express");
const languageController = require("../controllers/language.controller");
const {redisCacheMiddleware} = require('../middleware/cacheMiddleware')

const languageRoutes = express.Router();

languageRoutes.get("/getAll", redisCacheMiddleware(), languageController.getLanguages);
languageRoutes.get("/getById/:id", redisCacheMiddleware(), languageController.getById);
languageRoutes.get("/getByCode/:code", redisCacheMiddleware(), languageController.getByCode);
languageRoutes.post("/create", languageController.create);
languageRoutes.put("/update/:id", languageController.update);
languageRoutes.delete("/delete/:id", languageController.delete);

module.exports = languageRoutes;
