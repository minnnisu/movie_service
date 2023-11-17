require("dotenv").config();
const movieModel = require("../model/movieModel");
const movieScheduleModel = require("../model/movieScheduleModel");
const HttpError = require("../error/HttpError");

exports.getMoviesSummary = async function () {
  return await movieModel.getMoviesSummary();
};

exports.getMovieByTitle = async function (title) {
  if (title === undefined) {
    throw new HttpError(404, "not_found_page", { isShowErrPage: true });
  }

  return await movieModel.getMovieByTitle(title);
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
    const {
      movie_time_id,
      title,
      room_id,
      start_time,
      end_time,
      ordered_seat_count,
    } = movie;

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
      movie_time_id,
      start_time,
      end_time,
      ordered_seat_count,
    });
  });

  return groupedMovie;
}

exports.getMovieOrderPage = async function (date) {
  if (date === undefined) date = getToday_Y_M_D();
  const moviesSchedule = await movieScheduleModel.getDateMovieSchedule(date);
  const groupedMovieSchedule = groupMoviesSchedule(moviesSchedule);
  return groupedMovieSchedule;
};
