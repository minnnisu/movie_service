const express = require("express");
const router = express.Router();
const indexController = require("../../../controller/indexController");
const authMiddleware = require("../../middleware/authMiddleware");
const headerMiddleware = require("../../middleware/headerMiddleware");

router.get("/", headerMiddleware.getHeaderData, indexController.getMainPage);

router.get(
  "/login",
  authMiddleware.isLogoutStatusClosure({
    isShowErrPage: true,
  }),
  headerMiddleware.getHeaderData,
  indexController.getLoginPage
);

router.get(
  "/signup",
  authMiddleware.isLogoutStatusClosure({
    isShowErrPage: true,
  }),
  headerMiddleware.getHeaderData,
  indexController.getSignUpPage
);

router.get(
  "/tempPayment",
  authMiddleware.isLoginStatusClosure({
    isShowErrPage: true,
  }),
  function (req, res) {
    res.render("temp_payment");
  }
);

module.exports = router;
