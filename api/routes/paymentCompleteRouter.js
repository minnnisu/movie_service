const express = require("express");
const router = express.Router();
const authMiddleware = require("../../api/middleware/authMiddleware");
const paymentController = require("../../controller/paymentController");

router.get(
  "/",
  authMiddleware.isLoginStatus,
  paymentController.getPaymentCompletePage
);

module.exports = router;
