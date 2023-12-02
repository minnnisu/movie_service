const pool = require("./index");

exports.getMovieTrailers = async function (titie) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    `SELECT title, description, 
      CONCAT('http://localhost:8080/videos/', mv.video_name) AS video_url,
      CONCAT('http://localhost:8080/images/thumbnail/', mi.image_name) AS image_url
    FROM movieImages mi LEFT JOIN movieVideos mv ON mi.video_name = mv.video_name  
    WHERE title = ?`,
    [titie]
  );
  connection.release();

  return rows;
};
