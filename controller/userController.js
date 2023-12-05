const HttpError = require("../error/HttpError");
const userService = require("../service/userService");

exports.getUser = async function (req, res, next) {
  try {
    const user = await userService.getUser(req.user);
    const orderList = await userService.getLatestOrderList(req.user);
    return res.render("my_page", { header: req.headerData, user, orderList });
  } catch (err) {
    console.log(err);
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
    return res.render("order_list", { header: req.headerData, orderList });
  } catch (err) {
    console.log(err);
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.updateUserPage = async function (req, res, next) {
  try {
    const user = await userService.getUser(req.user);
    const orderList = await userService.getLatestOrderList(req.user);
    return res.render("user_update_page", {
      header: req.headerData,
      user,
      orderList,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.deleteUserPage = async function (req, res, next) {
  try {
    const user = await userService.getUser(req.user);

    return res.render("user_delete_page", {
      header: req.headerData,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.updateUser = async function (req, res, next) {
  try {
    await userService.updateUser(req.user, req.body);
    res.status(201).json({ message: "Successfully update user!" });
  } catch (error) {
    return next(error);
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
    console.error(error);
    return next(error);
  }
};
