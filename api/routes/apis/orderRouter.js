const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const orderController = require("../../../controller/orderController");

router.delete(
  "/:order_id",
  authMiddleware.isLoginStatusClosure(),
  orderController.cancelOrder
);

module.exports = router;
