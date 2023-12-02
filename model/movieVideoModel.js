const pool = require("./index");

exports.getMovieVideos = async function (titie) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "SELECT title, description, CONCAT('http://localhost:8080/video/', video_name) AS video_url FROM movieVideos WHERE title = ?",
    [titie]
  );
  connection.release();

  return rows;
};
