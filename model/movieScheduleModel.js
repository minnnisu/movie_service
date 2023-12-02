const pool = require("./index");

exports.getMovieScheduleByDate = async function (date) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT movie_time_id,
        title, 
        (SELECT age_limit FROM movies WHERE title = ms.title) AS age_limit,
        room_id, 
        DATE_FORMAT(CONVERT_TZ(start_time, 'UTC', 'Asia/Seoul'), '%H:%i') AS start_time,
        DATE_FORMAT(CONVERT_TZ(end_time, 'UTC', 'Asia/Seoul'), '%H:%i') AS end_time,
        ordered_seat_count 
      FROM movieSchedule ms 
      WHERE start_time BETWEEN ? AND ? 
      ORDER BY title, room_id, start_time;`,
      [`${date} 00:00`, `${date} 23:59`]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

exports.getMovieScheduleByMovieTimeId = async function (movieTimeId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM movieSchedule WHERE movie_time_id = ?`,
      [movieTimeId]
    );
    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
