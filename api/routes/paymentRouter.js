const express = require("express");
const router = express.Router();
const authMiddleware = require("../../api/middleware/authMiddleware");
const paymentController = require("../../controller/paymentController");

router.post(
  "/ticket",
  authMiddleware.isLoginStatus,
  paymentController.payMovieTicket
);

module.exports = router;
