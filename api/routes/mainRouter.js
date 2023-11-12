const express = require("express");
const router = express.Router();
const mainController = require("../../controller/mainController");

router.get("/", mainController.getMainPage);

module.exports = router;
