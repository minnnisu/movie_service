const express = require("express");
const router = express.Router();
const movieController = require("../../../controller/movieController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get(
  "/ticketing/personSeat",
  authMiddleware.isLoginStatusClosure(),
  movieController.getMoviePersonSeat
);

module.exports = router;
