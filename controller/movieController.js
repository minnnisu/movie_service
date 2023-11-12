const pool = require("../db/dbConnect");
const createError = require("http-errors");

exports.getMovieInfoPage = async function (req, res, next) {
  const connection = await pool.getConnection();
  console.log(req.params.title);

  try {
    const [rows] = await connection.query(
      `SELECT poster_image, title, summary, running_time, age_limit, released_date FROM movies WHERE title = ?`,
      [req.params.title]
    );
    console.log({ movies: rows });
    res.render("movie_info.ejs", { movies: rows });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  } finally {
    connection.release();
  }
};
