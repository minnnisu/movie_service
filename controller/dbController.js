const pool = require("../db/dbConnect");

exports.getUser = async function (id) {
  const connection = await pool.getConnection();
  const [user = rows] = await connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  connection.release();

  return user;
};
