const pool = require("./index");

exports.calcTotalTicketPrice = async function (personType) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query(
    `SELECT 
    (SELECT price * ? FROM personTypes WHERE person_type = 'adult') + 
    (SELECT price * ? FROM personTypes WHERE person_type = 'senior') + 
    (SELECT price * ? FROM personTypes WHERE person_type = 'teenager') 
    as TicketPrice;`,
    [personType.teenager, personType.adult, personType.senior]
  );
  connection.release();

  return rows[0].TicketPrice;
};
