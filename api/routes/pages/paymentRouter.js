const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const paymentController = require("../../../controller/paymentController");

router.get(
  "/complete",
  authMiddleware.isLoginStatus,
  paymentController.getPaymentCompletePage
);

module.exports = router;
