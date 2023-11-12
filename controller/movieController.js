const pool = require("../db/dbConnect");
const createError = require("http-errors");

exports.getMovieInfoPage = async function (req, res, next) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT poster_image, title, summary, running_time, age_limit, DATE_FORMAT(released_date, '%Y-%m-%d') AS released_date FROM movies WHERE title = ?`,
      [req.params.title]
    );
    res.render("movie_info.ejs", { movies: rows });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  } finally {
    connection.release();
  }
};

function getToday_Y_M_D() {
  const today = new Date();

  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}

function filterMoviesSchedule(moviesSchedule) {
  let currentMovieTitle = moviesSchedule[0]["title"];
  let currentMovieSchedule = { title: currentMovieTitle, scheduleList: [] };
  const filterdMoviesSchedule = [];
  moviesSchedule.map((movieSchedule) => {
    if (currentMovieTitle !== movieSchedule["title"]) {
      currentMovieTitle = movieSchedule["title"];
      filterdMoviesSchedule.push(currentMovieSchedule);
      currentMovieSchedule = { title: currentMovieTitle, scheduleList: [] };
    }

    const { room_id, start_time, end_time, ordered_seat_count } = movieSchedule;
    currentMovieSchedule["scheduleList"].push({
      room_id,
      start_time,
      end_time,
      ordered_seat_count,
    });
  });

  filterdMoviesSchedule.map((MovieSchedule) => {
    console.log(MovieSchedule["title"]);
    MovieSchedule["scheduleList"].map((schedule) => {
      const { room_id, start_time, end_time, ordered_seat_count } = schedule;
      console.log(room_id, start_time, end_time, ordered_seat_count);
    });
  });

  return filterdMoviesSchedule;
}

exports.getMovieOrderPage = async function (req, res, next) {
  const connection = await pool.getConnection();

  let date = getToday_Y_M_D();
  if (req.query.date) date = req.query.date;

  try {
    const [todayMoviesSchedule = rows] = await connection.query(
      `SELECT title, room_id, DATE_FORMAT(start_time, '%Y-%m-%d %H:%i') AS start_time, 
        DATE_FORMAT(end_time, '%Y-%m-%d %H:%i') AS end_time, 
        ordered_seat_count FROM movieSchedule WHERE start_time BETWEEN ? AND ? ORDER BY title, room_id, start_time;`,
      [`${date} 00:00`, `${date} 23:59`]
    );

    const filterdMoviesSchedule = filterMoviesSchedule(todayMoviesSchedule);

    res.status(200).json({ todayMoviesSchedule: filterdMoviesSchedule });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  } finally {
    connection.release();
  }
};
