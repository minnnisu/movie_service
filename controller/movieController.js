const movieService = require("../service/movieService");
const userController = require("../controller/userController");
const HttpError = require("../error/HttpError");

exports.getMovieInfoPage = async function (req, res, next) {
  try {
    const movie = await movieService.getMovieInfo(req.params.title);
    console.log({ ...movie, header: req.headerData });
    res.render("movie_info.ejs", { ...movie, header: req.headerData });
  } catch (err) {
    console.log(err);
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getMovieTicketingPage = async function (req, res, next) {
  try {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const moviesSchedule = await movieService.getMovieScheduleByDate(
      req.query.date
    );

    res.render("ticketing", {
      header: req.headerData,
      today: formattedDate,
      moviesSchedule,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getMoviePersonSeatPage = async function (req, res, next) {
  try {
    // const seats = await movieService.getMoviePersonSeatByMovieTimeId(
    //   req.query.movie_time_id
    // );

    const movies = await movieService.getMovieInfoByMovieTimeId(
      req.query.movie_time_id
    );

    console.log(movies[0]);

    return res.render("seats", { header: req.headerData, movie: movies[0] });
  } catch (err) {
    console.log(err);
    if (err instanceof HttpError) {
      err.option = { isShowErrPage: true };
      return next(err);
    }

    return next(new HttpError(500, "server_error", { isShowErrPage: true }));
  }
};

exports.getMoviePersonSeat = async function (req, res, next) {
  try {
    const seats = await movieService.getMoviePersonSeatByMovieTimeId(
      req.query.movie_time_id
    );

    return res.json(seats);
  } catch (error) {
    next(error);
  }
};
