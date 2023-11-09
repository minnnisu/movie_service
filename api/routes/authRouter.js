const express = require("express");
const router = express.Router();
const authController = require("../../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/local/login",
  authMiddleware.isLogoutStatus,
  authController.localLogin
);

router.post("/signup", authMiddleware.isLogoutStatus, authController.signup);

router.post("/logout", authMiddleware.isLoginStatus, authController.logout);

module.exports = router;
