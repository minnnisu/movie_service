const HttpError = require("../error/HttpError");
const orderModel = require("../model/orderModel");

exports.cancelOrder = async function (orderId) {
  if (orderId === undefined) {
    throw new HttpError(400, "not_contain_nessary_params");
  }

  const order = await orderModel.getOrderByOrderId(orderId);
  if (order.length < 1) {
    throw new HttpError(404, "not_exist_order_error");
  }

  const orderStatus = await orderModel.getOrderStatusByOrderId(orderId);
  if (orderStatus !== "예매 취소 가능") {
    throw new HttpError(400, "cannot_cancel_order_error");
  }

  await orderModel.cancelOrder(orderId);
};
