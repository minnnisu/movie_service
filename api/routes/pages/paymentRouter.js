const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const paymentController = require("../../../controller/paymentController");
const headerMiddleware = require("../../middleware/headerMiddleware");

router.get(
  "/",
  authMiddleware.isLoginStatusClosure({
    isShowErrPage: true,
  }),
  headerMiddleware.getHeaderData,
  paymentController.getPaymentPage
);

router.get(
  "/complete",
  authMiddleware.isLoginStatusClosure({
    isShowErrPage: true,
  }),
  headerMiddleware.getHeaderData,
  paymentController.getPaymentCompletePage
);

module.exports = router;
