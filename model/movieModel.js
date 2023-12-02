const pool = require("./index");

exports.getMoviesSummary = async function () {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT poster_image, title, running_time, age_limit FROM movies`
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

exports.getMovieByTitle = async function (title) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT poster_image, title, summary, running_time, age_limit, DATE_FORMAT(CONVERT_TZ(released_date, 'UTC', 'Asia/Seoul'), '%Y-%m-%d') AS released_date FROM movies WHERE title = ?`,
      [title]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
