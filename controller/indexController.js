const HttpError = require("../error/HttpError");
const movieService = require("../service/movieService");

exports.getMainPage = async function (req, res, next) {
  try {
    const movies = await movieService.getMovieSummaryList();
    res.render("index", { header: req.headerData, movies });
  } catch (error) {
    console.log(error);
    next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getLoginPage = async function (req, res, next) {
  try {
    res.render("login", { header: req.headerData });
  } catch (error) {
    console.log(error);
    next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getSignUpPage = async function (req, res, next) {
  try {
    res.render("signup", { header: req.headerData });
  } catch (error) {
    console.log(error);
    next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};
