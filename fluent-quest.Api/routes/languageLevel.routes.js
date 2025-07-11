const express = require("express");

const languageLevelController = require("../controllers/languageLevel.controller");
const languageLevelRoutes = express.Router();

languageLevelRoutes.get("/getAll", languageLevelController.getAll);
languageLevelRoutes.post("/create", languageLevelController.create);

module.exports = languageLevelRoutes;
