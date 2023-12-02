const movieService = require("../service/movieService");
const userController = require("../controller/userController");
const HttpError = require("../error/HttpError");

exports.getMovieInfoPage = async function (req, res, next) {
  try {
    const movie = await movieService.getMovieInfo(req.params.title);
    res.render("movie_info.ejs", { header: req.headerData, movie });
  } catch (err) {
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getMovieTicketingPage = async function (req, res, next) {
  try {
    const moviesSchedule = await movieService.getMovieScheduleByDate(
      req.query.date
    );
    res.render("ticketing", { header: req.headerData, moviesSchedule });
  } catch (err) {
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getMoviePersonSeatPage = async function (req, res, next) {
  try {
    const seats = await movieService.getMoviePersonSeatByMovieTimeId(
      req.query.movie_time_id
    );

    return res.render("seats", { header: req.headerData, seats });
  } catch (err) {
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};
