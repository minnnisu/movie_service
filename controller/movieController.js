const movieService = require("../service/movieService");
const HttpError = require("../error/HttpError");

exports.getMovieInfoPage = async function (req, res, next) {
  try {
    const movie = await movieService.getMovieByTitle(req.params.title);
    res.render("movie_info.ejs", { movie });
  } catch (err) {
    console.error(err);
    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getMovieTicketingPage = async function (req, res, next) {
  try {
    const moviesSchedule = await movieService.getMovieScheduleByDate(
      req.query.date
    );
    res.render("ticketing", { moviesSchedule });
  } catch (err) {
    console.error(err);
    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};
