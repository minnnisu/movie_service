const express = require("express");
const router = express.Router();
const userController = require("../../../controller/userController");
const headerMiddleware = require("../../middleware/headerMiddleware");
const authMiddleware = require("../../middleware/authMiddleware");

router.get(
  "/profile",
  authMiddleware.isLoginStatusClosure({
    isShowErrPage: true,
  }),
  headerMiddleware.getHeaderData,
  userController.getUser
);
router.get(
  "/orderList",
  authMiddleware.isLoginStatusClosure({
    isShowErrPage: true,
  }),
  headerMiddleware.getHeaderData,
  userController.getOrderedList
);

module.exports = router;
