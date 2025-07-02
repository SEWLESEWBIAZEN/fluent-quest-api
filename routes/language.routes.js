const express = require("express");
const languageController = require("../controllers/language.controller");

const languageRoutes = express.Router();

languageRoutes.post("/create", languageController.create);

module.exports = languageRoutes;
