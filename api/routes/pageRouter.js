const express = require("express");
const router = express.Router();
const pageController = require("../../controller/pageController");

router.get("/", pageController.getMainPage);
router.get("/summary/:title", pageController.getSummaryPage);

module.exports = router;
