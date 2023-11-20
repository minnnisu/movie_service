const pool = require("./index");

exports.getpaymentCompleteInfoByOrderID = async function (orderId) {
  const connection = await pool.getConnection();

  try {
    const [orderAndSchedule = rows] = await connection.query(
      `SELECT title, room_id, DATE_FORMAT(start_time, '%Y-%m-%d %H:%i') AS start_time, DATE_FORMAT(end_time, '%Y-%m-%d %H:%i') AS end_time, price
          FROM movieSchedule, (SELECT * FROM orders WHERE order_id = ?) orders 
          WHERE movieSchedule.movie_time_id = orders.movie_time_id;`,
      [orderId]
    );

    return orderAndSchedule;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

exports.getOrderInfoByUserID = async function (id) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT o.order_id, title, poster_image, age_limit, room_id, start_time, end_time, seats
      FROM(SELECT order_id, m.title AS title, age_limit, poster_image, room_id, start_time, end_time
      FROM movies AS m,
      (SELECT order_id, title, room_id, DATE_FORMAT(start_time, '%Y-%m-%d %H:%i') AS start_time, DATE_FORMAT(end_time, '%Y-%m-%d %H:%i') AS end_time
      FROM movieSchedule, (SELECT * FROM orders WHERE order_id IN (SELECT order_id FROM orders WHERE user_id = ?)) orders
      WHERE movieSchedule.movie_time_id = orders.movie_time_id) o
      WHERE m.title = o.title) o,
      (SELECT order_id, GROUP_CONCAT(CONCAT(seat_row, seat_col) ORDER BY seat_col SEPARATOR ', ') AS seats
      FROM orderedSeats
      WHERE order_id IN (SELECT order_id FROM orders WHERE user_id = ?)
      GROUP BY order_id) s
      WHERE o.order_id = s.order_id;`,
      [id, id]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
