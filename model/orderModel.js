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
