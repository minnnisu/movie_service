const HttpError = require("../error/HttpError");
const userService = require("../service/userService");

exports.getUser = async function (req, res, next) {
  try {
    const user = await userService.getUser(req.user);
    return res.render("my_page", { user });
  } catch (err) {
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getOrderedList = async function (req, res, next) {
  try {
    const orderList = await userService.getOrderList(req.user);
    return res.render("order_list", { orderList });
  } catch (err) {
    console.log(err);
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.deleteUser = async function (req, res, next) {
  try {
    await userService.deleteUser(req.user);
    req.logout(function (err) {
      if (err) {
        return next(new HttpError(500, "logout_error"));
      }
      res.status(201).json({ message: "Successfully delete user!" });
    });
  } catch (error) {
    return next(err);
  }
};
