const express = require("express");
const languageController = require("../controllers/language.controller");

const languageRoutes = express.Router();

languageRoutes.get("/getAll", languageController.getLanguages);
languageRoutes.get("/getById/:id", languageController.getById);
languageRoutes.get("/getByCode/:code", languageController.getByCode);
languageRoutes.post("/create", languageController.create);
languageRoutes.put("/update/:id", languageController.update);

module.exports = languageRoutes;
