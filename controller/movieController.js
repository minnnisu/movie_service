const pool = require("../db/dbConnect");
const createError = require("http-errors");

exports.getMovieInfoPage = async function (req, res, next) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT poster_image, title, summary, running_time, age_limit, DATE_FORMAT(released_date, '%Y-%m-%d') AS released_date FROM movies WHERE title = ?`,
      [req.params.title]
    );
    res.render("movie_info.ejs", { movies: rows });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  } finally {
    connection.release();
  }
};
