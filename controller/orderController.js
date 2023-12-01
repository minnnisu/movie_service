const orderService = require("../service/orderService");

exports.cancelOrder = async function (req, res, next) {
  try {
    await orderService.cancelOrder(req.params.order_id);
    return res.status(200).json({ message: "Successfully cancel order!" });
  } catch (error) {
    next(error);
  }
};
