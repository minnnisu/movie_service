const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const paymentController = require("../../../controller/paymentController");

router.post(
  "/ticket",
  authMiddleware.isLoginStatusClosure(),
  paymentController.payMovieTicket
);

router.get(
  "/selectedSeat",
  authMiddleware.isLoginStatusClosure(),
  paymentController.getSelectedSeatInfo
);

module.exports = router;
