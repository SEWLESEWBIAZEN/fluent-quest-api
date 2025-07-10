const express = require("express");

const languageLevelController = require("../controllers/languageLevel.controller");
const languageLevelRoutes = express.Router();

languageLevelRoutes.post("/create", languageLevelController.create);

module.exports = languageLevelRoutes;
