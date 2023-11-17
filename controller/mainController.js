const createError = require("http-errors");
const movieService = require("../service/movieService");
const HttpError = require("../error/HttpError");

exports.getMainPage = async function (req, res, next) {
  try {
    const movies = await movieService.getMoviesSummary();
    res.render("main.ejs", { movies });
  } catch (err) {
    console.error(err);
    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};
