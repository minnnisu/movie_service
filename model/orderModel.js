const pool = require("./index");

exports.addNewOrder = async function ({
  user_id,
  movie_time_id,
  seat_count,
  price,
  seatNameList,
}) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      "INSERT INTO orders(user_id, movie_time_id, seat_count, price)  VALUES(?, ?, ?, ?);",
      [user_id, movie_time_id, seat_count, price]
    );

    const [orderId = rows] = await connection.query(
      `SELECT LAST_INSERT_ID() AS orderId;`
    );

    for (const seatName of seatNameList) {
      await connection.query(
        "INSERT INTO orderedSeats(order_id, seat_row, seat_col, person_type) VALUES(?, ?, ?, ?);",
        [
          orderId[0].orderId,
          seatName.seat_row,
          seatName.seat_col,
          seatName.person_type,
        ]
      );
    }

    await connection.query(
      `UPDATE movieSchedule SET ordered_seat_count = ordered_seat_count + ? WHERE movie_time_id = ?;`,
      [seat_count, movie_time_id]
    );

    await connection.commit();

    return orderId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.getOrderByOrderId = async function (orderId) {
  const connection = await pool.getConnection();

  const [rows] = await connection.query(
    `SELECT *
    FROM orders
    WHERE order_id = ?;`,
    [orderId]
  );

  return rows;
};

exports.getOrderStatusByOrderId = async function (orderId) {
  const connection = await pool.getConnection();

  const [rows] = await connection.query(
    `SELECT 
      CASE WHEN o.canceled_at IS NOT NULL THEN "예매 취소됨" WHEN ms.start_time < NOW() THEN "상영 종료" ELSE "예매 취소 가능" END AS status
    FROM orders o LEFT JOIN movieSchedule ms ON o.movie_time_id = ms.movie_time_id
    WHERE o.order_id = ?;`,
    [orderId]
  );

  return rows[0].status;
};

exports.cancelOrder = async function (orderId) {
  const connection = await pool.getConnection();

  await connection.query(
    `UPDATE orders
    SET canceled_at = NOW()
    WHERE order_id = ?`,
    [orderId]
  );
};
