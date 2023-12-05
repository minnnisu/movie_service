const express = require("express");
const router = express.Router();
const movieController = require("../../../controller/movieController");
const authMiddleware = require("../../middleware/authMiddleware");
const headerMiddleware = require("../../middleware/headerMiddleware");

router.get(
  "/movieDetail/:title",
  headerMiddleware.getHeaderData,
  movieController.getMovieInfoPage
);
router.get(
  "/ticketing",
  headerMiddleware.getHeaderData,
  movieController.getMovieTicketingPage
);
router.get(
  "/ticketing/personSeat",
  authMiddleware.isLoginStatusClosure({
    isShowErrPage: true,
  }),
  headerMiddleware.getHeaderData,
  movieController.getMoviePersonSeatPage
);

module.exports = router;
