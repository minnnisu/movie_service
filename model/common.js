const pool = require("./index");

exports.getpaymentCompleteInfoByOrderID = async function (orderId) {
  const connection = await pool.getConnection();

  try {
    const [orderAndSchedule = rows] = await connection.query(
      `SELECT title, room_id, DATE_FORMAT(CONVERT_TZ(start_time, 'UTC', 'Asia/Seoul'), '%Y-%m-%d %H:%i') AS start_time, DATE_FORMAT(CONVERT_TZ(end_time, 'UTC', 'Asia/Seoul'), '%Y-%m-%d %H:%i') AS end_time, price
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
      `SELECT o.order_id, m.age_limit, m.title, m.poster_image, ms.room_id, 
        DATE_FORMAT(CONVERT_TZ(ms.start_time, 'UTC', 'Asia/Seoul'), '%Y년 %m월 %d일') AS start_day, 
        DATE_FORMAT(CONVERT_TZ(ms.start_time, 'UTC', 'Asia/Seoul'), '%H:%i') AS start_time, 
        DATE_FORMAT(CONVERT_TZ(ms.end_time, 'UTC', 'Asia/Seoul'), '%H:%i') AS end_time,
        (SELECT GROUP_CONCAT(CONCAT(seat_row, seat_col) ORDER BY seat_col SEPARATOR ', ')
        FROM orderedSeats
        WHERE order_id = o.order_id) seats,
        CASE WHEN o.canceled_at IS NOT NULL THEN "예매 취소됨" WHEN ms.start_time < NOW() THEN "상영 종료" ELSE "예매 취소" END AS status
      FROM orders o LEFT JOIN movieSchedule ms ON o.movie_time_id = ms.movie_time_id LEFT JOIN movies m ON ms.title = m.title
      WHERE o.user_id = ?
      ORDER BY o.order_id DESC;`,
      [id]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

exports.getLatestOrderInfoByUserID = async function (id) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT o.order_id, m.age_limit, m.title, m.poster_image, ms.room_id, 
        DATE_FORMAT(CONVERT_TZ(ms.start_time, 'UTC', 'Asia/Seoul'), '%Y-%m-%d %H:%i') AS start_time, 
        DATE_FORMAT(CONVERT_TZ(ms.end_time, 'UTC', 'Asia/Seoul'), '%H:%i') AS end_time,
        (SELECT GROUP_CONCAT(CONCAT(seat_row, seat_col) ORDER BY seat_col SEPARATOR ', ')
        FROM orderedSeats
        WHERE order_id = o.order_id) seats,
        CASE WHEN o.canceled_at IS NOT NULL THEN "예매 취소됨" WHEN ms.start_time < NOW() THEN "상영 종료" ELSE "예매 취소 가능" END AS status
      FROM orders o LEFT JOIN movieSchedule ms ON o.movie_time_id = ms.movie_time_id LEFT JOIN movies m ON ms.title = m.title
      WHERE o.user_id = ?
      ORDER BY o.order_id DESC
      LIMIT 3;`,
      [id]
    );

    return rows;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};
