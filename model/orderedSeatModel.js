const pool = require("./index");

exports.getOrderedSeatsByMovieTime = async function (movieTimeId) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    `SELECT seat_row, seat_col 
    FROM (SELECT * from orders where movie_time_id = ?) as orders, orderedSeats 
    WHERE orders.order_id = orderedSeats.order_id AND canceled_at is NULL;`,
    [movieTimeId]
  );
  connection.release();

  return rows;
};

exports.getSeatNameByOrderId = async function (orderId) {
  const connection = await pool.getConnection();

  const [seats = rows] = await connection.query(
    `SELECT seat_row, seat_col FROM orderedSeats WHERE order_id = ?;`,
    [orderId]
  );
  connection.release();

  return seats;
};
