const HttpError = require("../error/HttpError");
const indexService = require("../service/indexService");

exports.getMainPage = async function (req, res, next) {
  try {
    const data = await indexService.getMainPage(req.user);
    res.render("index", { ...data });
  } catch (error) {
    console.log(error);
    next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getLoginPage = async function (req, res, next) {
  try {
    const user = await indexService.getLogInOutPage(req.user);
    res.render("login", { user });
  } catch (error) {
    console.log(error);
    next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getSignUpPage = async function (req, res, next) {
  try {
    const user = await indexService.getLogInOutPage(req.user);
    res.render("signup", { user });
  } catch (error) {
    console.log(error);
    next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};
