const pool = require("./index");

exports.getOrderedSeatsAboutMovieTime = async function (movieTimeId) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    `SELECT seat_row, seat_col 
    FROM orders, orderedSeats 
    WHERE orders.order_id = orderedSeats.order_id 
    AND movie_time_id = ? 
    AND canceled_at is NULL;`,
    [movieTimeId]
  );
  connection.release();

  return rows;
};
