const createError = require("http-errors");
const movieScheduleModel = require("../model/movieScheduleModel");
const movieModel = require("../model/movieModel");

exports.getMovieInfoPage = async function (req, res, next) {
  if (!req.params.title) {
    return next(createError(404, "not_found_page", { isShowErrPage: true }));
  }

  try {
    const movie = await movieModel.getMovieInfo(req.params.title);
    res.render("movie_info.ejs", { movie });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
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

function groupMoviesSchedule(moviesSchedule) {
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
  let date = getToday_Y_M_D();
  if (req.query.date) date = req.query.date;

  try {
    const moviesSchedule = await movieScheduleModel.getMovieSchedule(date);
    const groupedMovieSchedule = groupMoviesSchedule(moviesSchedule);

    res.render("ticketing", { moviesSchedule: groupedMovieSchedule });
  } catch (err) {
    console.log(err);
    next(createError(500, "database_error", { isShowErrPage: true }));
  }
};
