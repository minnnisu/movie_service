const express = require("express");
const router = express.Router();
const movieController = require("../../../controller/movieController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/movieDetail/:title", movieController.getMovieInfoPage);
router.get("/ticketing", movieController.getMovieTicketingPage);
router.get(
  "/ticketing/personSeat",
  authMiddleware.isLoginStatus,
  movieController.getMoviePersonSeatPage
);

module.exports = router;
