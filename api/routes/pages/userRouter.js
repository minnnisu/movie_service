const express = require("express");
const router = express.Router();
const userController = require("../../../controller/userController");
const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware.isLoginStatus, userController.getUser);
// router.get(
//   "/order",
//   authMiddleware.isLoginStatus,
//   userController.getOrderedList
// );

module.exports = router;
