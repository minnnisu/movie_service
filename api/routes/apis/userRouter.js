const express = require("express");
const router = express.Router();
const userController = require("../../../controller/userController");
const authMiddleware = require("../../middleware/authMiddleware");

router.delete(
  "/",
  authMiddleware.isLoginStatusClosure(),
  userController.deleteUser
);

module.exports = router;
