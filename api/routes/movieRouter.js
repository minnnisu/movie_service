const express = require("express");
const router = express.Router();
const movieController = require("../../controller/movieController");

router.get("/movieDetail/:title", movieController.getMovieInfoPage);
router.get("/ticketing", movieController.getMovieTicketingPage);

module.exports = router;
