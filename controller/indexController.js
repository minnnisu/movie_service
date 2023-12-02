const HttpError = require("../error/HttpError");
const indexService = require("../service/indexService");

exports.getMainPage = async function (req, res, next) {
  try {
    const data = await indexService.getMainPage(req.user);
    res.render("index", { ...data });
  } catch (error) {
    console.log(error);
    if (error instanceof Error || error.message === "not_exsit_user_error") {
      return req.logout(function (err) {
        if (err) {
          return next(new HttpError(500, "예상치 못한 오류가 발생하였습니다."));
        }
        res.redirect("/");
      });
    }
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
