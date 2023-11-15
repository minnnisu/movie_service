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
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      "INSERT INTO users(id, password, name, email, telephone) VALUES(?, ?, ?, ?, ?);",
      [id, hashedPassword, name, email, telephone]
    );

    console.log(rows);

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
