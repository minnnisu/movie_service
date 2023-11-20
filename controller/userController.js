const userService = require("../service/userService");

exports.getUser = async function (req, res, next) {
  try {
    const user = await userService.getUser(req.user);
    return res.render("my_page", { user });
  } catch (error) {
    return next(error);
  }
};

exports.getOrderedList = async function (req, res, next) {
  try {
    const orderList = await userService.getOrderList(req.user);
    return res.render("order_list", { orderList });
  } catch (error) {
    return next(error);
  }
};
