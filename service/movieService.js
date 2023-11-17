require("dotenv").config();
const movieModel = require("../model/movieModel");
const createError = require("http-errors");

exports.getMoviesSummary = async function () {
  return await movieModel.getMoviesSummary();
};
