require("dotenv").config();
const movieModel = require("../model/movieModel");
const createError = require("http-errors");

exports.getMainPage = async function (req, res, next) {
  try {
    const movies = await movieModel.getMoviesSummary();
    res.render("main.ejs", { movies });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  }
};
