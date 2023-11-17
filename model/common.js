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
