const express = require("express");
const router = express.Router();
const movieController = require("../../controller/movieController");

router.get("/:title", movieController.getMovieInfoPage);

module.exports = router;
