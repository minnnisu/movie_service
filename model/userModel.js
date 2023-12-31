const pool = require("./index");

exports.getUser = async function (id) {
  const connection = await pool.getConnection();
  const [user = rows] = await connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  connection.release();

  return user;
};

exports.checkIdDuplication = async function (id) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT id FROM users WHERE id = ?", [
    id,
  ]);
  connection.release();

  if (rows.length > 0) {
    return true;
  }

  return false;
};

exports.addNewUser = async function (userInfo) {
  const { id, hashedPassword, name, email, telephone } = userInfo;

  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    "INSERT INTO users(id, password, name, email, telephone) VALUES(?, ?, ?, ?, ?);",
    [id, hashedPassword, name, email, telephone]
  );

  connection.release();

  return rows;
};

exports.addNewGoogleUser = async function (userInfo) {
  const { id, name, email } = userInfo;

  const connection = await pool.getConnection();
  let query = "";
  let input = [];
  if (email) {
    query = "INSERT INTO users(id, name, email) VALUES(?, ?, ?);";
    input = [id, name, email];
  } else {
    query = "INSERT INTO users(id, name) VALUES(?, ?);";
    input = [id, name];
  }

  const [rows] = await connection.query(query, input);

  connection.release();

  return rows;
};

exports.updateUser = async function (userId, info) {
  const { name, email, telephone } = info;

  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    `
        UPDATE users 
        SET 
          name = ?,
          email = ?,
          telephone = ?
        WHERE id = ?`,
    [name, email, telephone, userId]
  );

  connection.release();

  return rows;
};

exports.deleteUser = async function (userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    connection.query(
      `
      UPDATE orders
      SET canceled_at = NOW()
      WHERE order_id IN
      (SELECT o.order_id
        FROM 
        (SELECT * FROM orders WHERE user_id = ?) o
        LEFT JOIN movieSchedule ms 
        ON o.movie_time_id = ms.movie_time_id
        WHERE o.canceled_at IS NULL AND ms.start_time > NOW())
        `,
      [userId]
    );
    connection.query("DELETE FROM users WHERE id = ?", [userId]);

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
