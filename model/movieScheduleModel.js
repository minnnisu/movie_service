const pool = require("./index");

exports.getMovieScheduleByDate = async function (date) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        m.title, 
        m.age_limit,
        m.running_time,
        DATE_FORMAT(CONVERT_TZ(m.released_date, 'UTC', 'Asia/Seoul'), '%Y.%m.%d') AS released_date,
        ms.movie_time_id,
        ms.room_id, 
        DATE_FORMAT(CONVERT_TZ(ms.start_time, 'UTC', 'Asia/Seoul'), '%H:%i') AS start_time,
        DATE_FORMAT(CONVERT_TZ(ms.end_time, 'UTC', 'Asia/Seoul'), '%H:%i') AS end_time,
        ms.ordered_seat_count
      FROM movieSchedule ms, movies m
      WHERE 
        ms.title = m.title AND 
        start_time BETWEEN ? AND ? 
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
