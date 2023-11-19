const indexService = require("../service/indexService");
const HttpError = require("../error/HttpError");

exports.getMainPage = async function (req, res, next) {
  try {
    const reponseDate = await indexService.getMainPage(req.user);
    res.render("index", { ...reponseDate });
  } catch (err) {
    console.error(err);
    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getLoginPage = async function (req, res, next) {
  try {
    res.render("login");
  } catch (error) {}
};

exports.getSignUpPage = async function (req, res, next) {
  try {
    res.render("signup");
  } catch (error) {}
};
