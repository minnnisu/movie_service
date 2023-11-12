require("dotenv").config();
const pool = require("../db/dbConnect");
const createError = require("http-errors");

exports.getMainPage = async function (req, res, next) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT poster_image, title, running_time, age_limit FROM movies`
    );
    console.log({ movies: rows });
    res.render("main.ejs", { movies: rows });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  } finally {
    connection.release();
  }
};
