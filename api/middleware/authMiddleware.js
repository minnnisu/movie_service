const HttpError = require("../../error/HttpError");

exports.isLoginStatus = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return next(new HttpError(401, "not_login_status_access_error"));
};

exports.isLogoutStatus = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (
    req.path === "/login" ||
    req.path === "/signup" ||
    req.path === "/user/profile" ||
    req.path === "/user/orderList"
  ) {
    return next(
      new HttpError(403, "not_logout_status_access_error", {
        isShowErrPage: true,
      })
    );
  }

  return next(new HttpError(403, "not_logout_status_access_error"));
};
