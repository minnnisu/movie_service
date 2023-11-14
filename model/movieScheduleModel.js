const pool = require("./index");

exports.getMovieSchedule = async function (date) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT title, room_id, DATE_FORMAT(start_time, '%Y-%m-%d %H:%i') AS start_time, 
            DATE_FORMAT(end_time, '%Y-%m-%d %H:%i') AS end_time, 
            ordered_seat_count FROM movieSchedule WHERE start_time BETWEEN ? AND ? ORDER BY title, room_id, start_time;`,
      [`${date} 00:00`, `${date} 23:59`]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};