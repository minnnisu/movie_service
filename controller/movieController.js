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

function GroupMoviesSchedule(moviesSchedule) {
  const groupedMovie = [];

  moviesSchedule.forEach((movie) => {
    const { title, room_id, start_time, end_time, ordered_seat_count } = movie;

    // title을 찾기
    let movieInfo = groupedMovie.find((item) => item.title === title);

    // title이 없다면 새로운 객체 추가
    if (!movieInfo) {
      movieInfo = {
        title,
        rooms: [],
      };
      groupedMovie.push(movieInfo);
    }

    // room_id를 찾기
    let roomInfo = movieInfo.rooms.find((room) => room.room_id === room_id);

    // room_id가 없다면 새로운 객체 추가
    if (!roomInfo) {
      roomInfo = {
        room_id,
        schedules: [],
      };
      movieInfo.rooms.push(roomInfo);
    }

    // 해당 정보 추가
    roomInfo.schedules.push({
      start_time,
      end_time,
      ordered_seat_count,
    });
  });

  return groupedMovie;
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

    const groupedMovieSchedule = GroupMoviesSchedule(todayMoviesSchedule);

    res.render("ticketing", { todayMoviesSchedule: groupedMovieSchedule });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  } finally {
    connection.release();
  }
};
