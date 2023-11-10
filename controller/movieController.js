const pool = require("../db/dbConnect");
const createError = require("http-errors");

// 파라미터
// query="영화제목"
// summary="true/false"
exports.getMovie = async function (req, res, next) {
  let sql = "SELECT * FROM movies";
  let params = [];

  if (req.query.summary) {
    sql = "SELECT title, summary, running_time FROM movies";
  }

  if (req.query.query) {
    sql = sql + " WHERE title = ?";
    params = [req.query.query];
  }

  const connection = await pool.getConnection();

  try {
    console.log(sql);
    const [rows] = await connection.query(sql, params);
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    next(createError("500", "database_error"));
  } finally {
    connection.release();
  }
};
